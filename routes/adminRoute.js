import express from "express";
import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authorizeAdmin from "../middlewares/authentication.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();


router.get("/msg", (req, res) => {
  res.json({ message: "hell world" });
});
 
// Admin registration
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "supposed to be only one admin" });
    }

    const adminData = new adminModel({ email, password: hashedPassword });
    const savedUser = await adminData.save();

    return res
      .status(201)
      .json({ message: "Admin registered successfully", data: savedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await adminModel.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "user not found" });
    }

    const ismatch = await bcrypt.compare(password, userExist.password);

    if (!ismatch) {
      return res.status(401).json({ error: "The password is invalid" });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });

    return res.status(200).json({
      message: "Logged in successfully",
      user: userExist,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// ✅ Get admin info (email only, never return hashed password)
router.get("/profile",  async (req, res) => {
  try {
    const admin = await adminModel.findById(req.admin.id).select("email");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// ✅ Update admin email and/or password
router.put("/profile",  async (req, res) => {
  try {
    const { email, password } = req.body;
    const updateData = {};

    if (email) {
      updateData.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      req.admin.id,
      updateData,
      { new: true, runValidators: true }
    ).select("email");

    return res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router
