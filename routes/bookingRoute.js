import express from "express";
import bookingModel from "../models/booking.js"; // import your booking model
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
 * CREATE BOOKING
 * @route POST /api/bookings
 */
router.post("/", async (req, res) => {
  try {
    const booking = new bookingModel(req.body);
    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * READ ALL BOOKINGS (ADMIN ONLY)
 * @route GET /api/bookings
 */
router.get("/",async (req, res) => {
  try {
    const bookings = await bookingModel.find();
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * READ SINGLE BOOKING
 * @route GET /api/bookings/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * UPDATE BOOKING (ADMIN ONLY)
 * @route PUT /api/bookings/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE BOOKING (ADMIN ONLY)
 * @route DELETE /api/bookings/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
