import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
const app = express()

// routes

import adminRoute from "./routes/adminRoute.js"; // ✅ correct ES import
import galleryRoute from "./routes/galleryRoute.js"
import bookingRoute from "./routes/bookingRoute.js"
import contactRoute from "./routes/contactRoute.js"

// middlewares
dotenv.config()
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
// database connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected successfully'))
  .catch((err) => console.error('❌ DB connection error:', err));



// route callings to server
app.use("/admin" , adminRoute);
app.use("/gallery" , galleryRoute)
app.use("/contact" , contactRoute)
app.use("/booking" , bookingRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
