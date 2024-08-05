// routes/resepRoutes.js

import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import resepController from "../controllers/resepController.js";

const router = express.Router();

// Middleware untuk logging HTTP request
const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

/* Routes untuk Admin */
// POST
router.post(
  "/admin/resep",
  logRequest,
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep,
);
// GET
router.get(
  "/admin/resep",
  logRequest,
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep,
);
// PUT
router.put(
  "/admin/resep/:id",
  logRequest,
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep,
);
router.delete(
  "/admin/resep/:id",
  logRequest,
  authenticateToken,
  isAdmin,
  resepController.adminCRUDResep,
);

// Routes untuk Pegawai
// POST
router.post(
  "/pegawai/resep",
  logRequest,
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep,
);
// GET
router.post(
  "/pegawai/resep",
  logRequest,
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep,
);
// PUT
router.put(
  "/pegawai/resep/:id",
  logRequest,
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep,
);
// DELETE
router.delete(
  "/pegawai/resep/:id",
  logRequest,
  authenticateToken,
  isEmployee,
  resepController.pegawaiCRUDResep,
);

// Routes untuk Pemilik
// POST
router.post(
  "/pemilik/resep",
  logRequest,
  authenticateToken,
  isOwner,
  resepController.pemilikReadResep,
);

export default router;
