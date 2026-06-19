const Assignment = require("../models/Assignment.js");
const Submission = require("../models/Submission.js");
const User = require("../models/User.js")

const {runSandboxQuery} = require("../utility/sandboxUtility.js")

const createAssignment = async(req,res) =>{
    try{
        const {title,description,difficulty,category,setupSQL,solutionSQL,hint}=req.body;
        if(!title || !description){
            return res.status(400).json({message:"Title and description are required"});
        }
        const assignment = await Assignment.create({
            title,
            description,
            difficulty:difficulty || "easy",
            category:category || "",
            setupSQL:setupSQL || "-- Write your setup SQL here",
            solutionSQL:solutionSQL || "-- Write the solution SQL here",
            hint:hint || "",
            createdBy:req.user._id
        });
        return res.status(201).json({message:"Assignment created Successfully",assignment});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
const getAllAssignments = async(req,res) =>{
    try{
        const assignments = await Assignment.find().sort("-createdAt");
        return res.json({assignments});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

const updateAssignment = async(req,res) =>{
    try{
        const existing = await Assignment.findById(req.params.id);
        if(!existing) return res.status(404).json({message:"Not Found"});
        const {title,description,difficulty,category,setupSQL,solutionSQL,hint} = req.body;
    const finalSetup = setupSQL !== undefined ? setupSQL : existing.setupSQL;
    const finalSolution = solutionSQL !== undefined ? solutionSQL : existing.solutionSQL;

    // Validate SQL if both fields are non-empty
    if (finalSetup && finalSolution) {
      const testRun = await runSandboxQuery(finalSetup, finalSolution);
      if (testRun.error) {
        return res.status(400).json({
          message: "SQL validation failed.",
          error: testRun.error,
        });
      }
    }

    if (title !== undefined) existing.title = title;
    if (description !== undefined) existing.description = description;
    if (difficulty !== undefined) existing.difficulty = difficulty;
    if (category !== undefined) existing.category = category;
    if (setupSQL !== undefined) existing.setupSQL = setupSQL;
    if (solutionSQL !== undefined) existing.solutionSQL = solutionSQL;
    if (hint !== undefined) existing.hint = hint;

    await existing.save();
    return res.json({ message: "Assignment updated", assignment: existing });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


const getAssignmentAdmin = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Not found" });
    return res.json( {assignment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const deleteAssignment = async (req,res) =>{
  try{
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if(!assignment) return res.status(404).json({message:"Not Found"});
    await Submission.deleteMany({assignment:req.params.id});
    return res.json({message:"Assignment Deleted"});
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const getAllUsers  = async (req,res) => {
  try{
    const users  = await User.find({}).select("-password");
    res.json({users});
  }
  catch(err){
    console.error(err.message);
    res.status(500).json({message:"Server error retrieving users."});
  }
}


module.exports = {createAssignment,getAllAssignments,getAssignmentAdmin,updateAssignment,deleteAssignment,getAllUsers}; 