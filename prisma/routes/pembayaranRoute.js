// routes/pembayaranRoutes.js

import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import pembayaranController from "../controllers/pembayaranController.js";

const router = express.Router();

// Routes untuk Admin
router.post(
  "/pembayaran",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);

// Routes untuk Pegawai
router.post(
  "/pembayaran",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);

// Routes untuk Pemilik
router.get(
  "/pembayaran",
  authenticateToken,
  pembayaranController.pemilikReadPembayaran
);

export default router;
