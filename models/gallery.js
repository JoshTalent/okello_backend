import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  type: { type: String, required: true },
  category: { type: String, required: true },
  src: { type: String, required: true },
  height: { type: String, required: true },
});

const galleryModel = mongoose.model("gallery", gallerySchema);

export default galleryModel;
