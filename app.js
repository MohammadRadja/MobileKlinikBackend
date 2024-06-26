import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import hewanRoute from "./prisma/routes/hewanRoute.js";
import obatRoute from "./prisma/routes/obatRoute.js";
import pembayaranRoute from "./prisma/routes/pembayaranRoute.js";
import rekammedisRoute from "./prisma/routes/rekammedisRoute.js";
import resepRoute from "./prisma/routes/resepRoute.js";
import authRoute from "./prisma/routes/authRoute.js";
import doctorRoute from "./prisma/routes/doctorRoute.js";
import appointmentRoute from "./prisma/routes/appointmentRoute.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: "http://localhost:50970 ", // Ganti dengan asal frontend Anda
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Use auth routes
app.use("/", authRoute);

// Use other routes
app.use("/", hewanRoute);
app.use("/", obatRoute);
app.use("/", pembayaranRoute);
app.use("/", rekammedisRoute);
app.use("/", resepRoute);
app.use("/", resepRoute);
app.use("/", doctorRoute);
app.use("/", appointmentRoute);

// Middleware logging
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
