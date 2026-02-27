const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Assignment = require("../models/Assignment.js");
const Submission = require("../models/Submission.js")
const jwt = require("jsonwebtoken");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {runSandboxQuery,compareResults} = require("../utility/sandboxUtility.js")

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(String(email || "").trim());

exports.register = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashed, // hashed in controller (as you wanted)
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle Mongo duplicate key race-condition
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};


function getCookieOptions() {
  // If frontend + backend are on different domains in production, you'll likely need:
  // sameSite: "none" AND secure: true (HTTPS only)
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // set true behind HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.login = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email }).select("+ password name email role");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    //console.log(user);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  // req.user is populated by requireAuth middleware
  return res.status(200).json({ user: req.user });
};


exports.getAllAssignments = async(req,res) =>{
  
    try{
            const assignments = await Assignment.find().sort("-createdAt");
            return res.json({assignments});
        }
        catch(err){
            return res.status(500).json({message:err.message});
        }
  
};

exports.getAssignment  = async(req,res) =>{
  try{
    const assignment = await Assignment.findById(req.params.id).select("-solutionSQL");
    if(!assignment) return res.status(404).json({message:"Not Found"});
    return res.json({assignment});
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

exports.runQuery = async (req,res) =>{
  try{
    const assignment = await Assignment.findById(req.params.id);
    if(!assignment) return res.status(404).json({message:"Assignment not found"});
    if(!assignment.setupSQL) {
      return res.status(400).json({message:"This assignment has no setupSQL to run"});
    }
    const {query} = req.body;
    if(!query?.trim()) return res.status(400).json({message:"Query is required in body"});
    const blocked = blockDangerousSQL(query);
    if(blocked) return res.status(400).json({message:blocked});

    const result = await runSandboxQuery(assignment.setupSQL,query);
    return res.json(result);

  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
};


exports.getExpectedOutput = async (req,res) =>{
    try
    {
        const assignment = await Assignment.findById(req.params.id);
        if(!assignment) return res.status(404).json({message:"Not Found"});

        if(!assignment.setupSQL || !assignment.solutionSQL){
            return res.status(400).json({message:"Assignment SQL not configured yet"});
        }
        const result  = await runSandboxQuery(assignment.setupSQL,assignment.solutionSQL);

        if(result.error){
            return res.status(500).json({message:"Error running expected output SQL",error:result.error});
        }
        return res.json({columns:result.columns,rows:result.rows});

    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
exports.submitAssignment = async(req,res) =>{
  try{
    const assignment = await Assignment.findById(req.params.id);
    if(!assignment) return res.status(404).json({message:"Not found"});
    const user = req.user;
   
    if(!assignment.setupSQL || !assignment.solutionSQL){
      return res.status(400).json({message:"Assignment SQL not configured yet."});
    }

    const { query } = req.body;
    if(!query.trim()){
      return res.status(400).json({message:"Query is required."});
    }

    const blocked = blockDangerousSQL(query);
    if(blocked) return res.status(400).json({message:blocked});

    const userResult = await runSandboxQuery(assignment.setupSQL,query);
    if(userResult.error){
      const submission = await Submission.create({
        user:req.user._id,
        assignment:assignment._id,
        query,
        passed:false,
        error:userResult.error,
      });
      return res.json({passed:false,error:userResult.error,submission});
    }

    const expectedResult = await runSandboxQuery(assignment.setupSQL,assignment.solutionSQL);

    if(expectedResult.error){
      return res.status(500).json({message:"Error running solution SQL.",error:expectedResult.error});
    }
//console.log("req.user in submitAssignment:", req.user);

    const passed = compareResults(userResult.rows,expectedResult.rows);
    const submission = await Submission.create({
      user:req.user.id,
      assignment:assignment._id,
      query,
      passed,
      userOutput:userResult.rows,
      expectedOutput:expectedResult.rows,
    });
    return res.json({
      passed,
     userOutput: { columns: userResult.columns, rows: userResult.rows },
      expectedOutput: { columns: expectedResult.columns, rows: expectedResult.rows },
      submission,
    });
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
};

exports.getSubmissionsByUser = async(req,res) =>{
  try{
    const userId = req.user.id;
    const submissions = await Submission.find({user:userId}).sort("-createdAt");
    //console.log(submissions);
    return res.json({submissions});
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}



exports.getHint = async (req,res) =>{
    try{
        const {currentSQL,description,setupSQL} = req.body;

        if(!currentSQL){
            return res.status(400).json({message:"You must type some SQL first to get an AI Hint"});
        }

        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({model:"gemini-2.5-flash"});
        const prompt = `
       You are an expert SQL teacher. The student is solving this assignment: "${description}".
      Database Schema: ${setupSQL || "Not explicitly provided."}
      Here is what the student has typed so far:
      \`\`\`sql
      ${currentSQL}
      \`\`\`
      Task:
      Check the student's code and give them a short 1-2 sentence hint pointing out syntax errors or conceptual flaws.
      IMPORTANT RULE: DO NOT GIVE THEM THE SOLUTION CODE. DO NOT WRITE ANY FINAL SQL CODE. Help them get there themselves.
    `;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return res.json({hint:result.response.text()});
    }
    catch(err){
        console.error("AI Hint Error:",err);
        return res.status(500).json({message:"Failed to generate AI hint."});
    }
};


function blockDangerousSQL(query) {
  const upper = query.toUpperCase().replace(/\s+/g, " ").trim();
  const dangerous = [
    "DROP DATABASE", "CREATE DATABASE",
    "ALTER ROLE", "CREATE ROLE", "DROP ROLE",
    "GRANT", "REVOKE", "COPY",
    "PG_READ_FILE", "PG_WRITE_FILE",
    "LO_IMPORT", "LO_EXPORT",
    "SET ROLE", "RESET ROLE",
    "CREATE EXTENSION",
    "DROP SCHEMA", "CREATE SCHEMA",
  ];

  for (const d of dangerous) {
    if (upper.includes(d)) {
      return `Blocked: "${d}" is not allowed in the sandbox.`;
    }
  }
  return null;
}