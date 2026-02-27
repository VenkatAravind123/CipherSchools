const express = require("express");
const userController = require("../controllers/userController.js");
const {requireAuth,requireRole} = require("../middleware/authMiddleware.js")
const router = express.Router();

router.post("/register", userController.register);
router.post("/login",userController.login);
router.post("/logout",userController.logout);
router.get("/me",requireAuth,userController.me);

//Assignments
router.get("/getallassignments",requireAuth,userController.getAllAssignments);
router.get("/assignment/:id",requireAuth,userController.getAssignment);
router.post("/assignment/:id/run",requireAuth,userController.runQuery)
router.get("/getexpectedoutput/:id",requireAuth,userController.getExpectedOutput);
router.post("/submit/:id",requireAuth,userController.submitAssignment);
router.get("/getsubmissionsbyuser",requireAuth,userController.getSubmissionsByUser);
router.post("/assignment/:id/hint",requireAuth,userController.getHint);

module.exports = router;