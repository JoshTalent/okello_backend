import express from "express";
import contactModel from "../models/contact.js";
import authorizeAdmin from "../middlewares/authentication.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

/**
 * TEST ROUTE
 */
router.get("/msg", (req, res) => {
  res.json({ message: "hello world" });
});

/**
 * CREATE CONTACT MESSAGE
 * @route POST /api/contacts
 */
router.post("/", async (req, res) => {
  try {
    const contact = new contactModel(req.body);
    await contact.save();
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET ALL CONTACTS (ADMIN ONLY)
 * @route GET /api/contacts
 */
router.get("/", authorizeAdmin, async (req, res) => {
  try {
    const contacts = await contactModel.find();
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * DELETE CONTACT (ADMIN ONLY)
 * @route DELETE /api/contacts/:id
 */
router.delete("/:id", authorizeAdmin, async (req, res) => {
  try {
    const contact = await contactModel.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
