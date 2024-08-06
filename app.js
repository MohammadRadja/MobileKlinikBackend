import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import hewanRoute from "./prisma/routes/hewanRoute.js";
import obatRoute from "./prisma/routes/obatRoute.js";
import pembayaranRoute from "./prisma/routes/pembayaranRoute.js";
import rekammedisRoute from "./prisma/routes/rekammedisRoute.js";
import resepRoute from "./prisma/routes/resepRoute.js";
import authRoute from "./prisma/routes/authRoute.js";
import dokterRoute from "./prisma/routes/dokterRoute.js";
import appointmentRoute from "./prisma/routes/appointmentRoute.js";
import dataPemilikRoute from "./prisma/routes/pemilikRoute.js";
import dataPegawaiRoute from "./prisma/routes/pegawaiRoute.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT;

// Middleware CORS
const corsOptions = {
  origin: "*", // Ganti dengan asal frontend Anda
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
app.use("/", dokterRoute);
app.use("/", appointmentRoute);
app.use("/", dataPemilikRoute);
app.use("/", dataPegawaiRoute);

// Middleware logging
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
