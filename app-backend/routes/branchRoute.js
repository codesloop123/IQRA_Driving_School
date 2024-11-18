const express = require("express");
const Branch = require("../models/Branch");
const router = express.Router();

// POST route to add a new instructor for a specific branch
router.post("/add_branch", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Please enter branch name" });
  }

  try {
    const newBranch = new Branch({ name });
    const savedBranch = await newBranch.save();
    if (savedBranch) {
      res
        .status(200)
        .json({ status: true, message: "Branch added successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET route to fetch all instructors for a specific branch
router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({status:true,branches:branches});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE route to remove an instructor by ID for a specific branch
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const branch = await Branch.findOneAndDelete({ _id: id });
    if (!branch) {
      return res.status(404).json({ msg: "branch not found" });
    }
    res.status(200).json({ msg: "branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
