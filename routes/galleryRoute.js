import express from "express";
import galleryModel from "../models/gallery.js";
import authorizeAdmin from "../middlewares/authentication.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

/**
 * CREATE GALLERY ITEM
 * @route POST /api/gallery
 */
router.post("/", authorizeAdmin, async (req, res) => {
  try {
    const galleryItem = new galleryModel(req.body);
    await galleryItem.save();
    res.status(201).json({ success: true, data: galleryItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET ALL GALLERY ITEMS
 * @route GET /api/gallery
 */
router.get("/", async (req, res) => {
  try {
    const galleryItems = await galleryModel.find();
    res.json({ success: true, data: galleryItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET SINGLE GALLERY ITEM
 * @route GET /api/gallery/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const galleryItem = await galleryModel.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    res.json({ success: true, data: galleryItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * UPDATE GALLERY ITEM
 * @route PUT /api/gallery/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const galleryItem = await galleryModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    res.json({ success: true, data: galleryItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE GALLERY ITEM
 * @route DELETE /api/gallery/:id
 */
router.delete("/:id",  async (req, res) => {
  try {
    const galleryItem = await galleryModel.findByIdAndDelete(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    res.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
