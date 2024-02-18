const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Render the dashboard page
router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      const students = await Student.find();
      res.render("dashboard", { user: req.session.user, students });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new student
router.post("/", async (req, res) => {
  try {
    const { id, name, address, phoneNumber, age, grade } = req.body;

    const existing = await Student.findOne({ id });
    if (existing) {
      return res.redirect("/dashboard?error=existing");
    }

    const newStudent = new Student({
      id,
      name,
      address,
      phoneNumber,
      age,
      grade,
    });
    await newStudent.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a student
router.post("/delete/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a student
router.get("/update/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    res.render("updateStudent", { student });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, address, phoneNumber, age, grade } = req.body;
    await Student.findByIdAndUpdate(studentId, {
      name,
      address,
      phoneNumber,
      age,
      grade,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
