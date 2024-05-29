import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import obatController from "../controllers/obatController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/obat",
  authenticateToken,
  isAdmin,
  obatController.adminCRUDObat
);
//GET -> READ
router.get(
  "/admin/obat",
  authenticateToken,
  isAdmin,
  obatController.adminCRUDObat
);
//PUT -> UPDATE
router.put(
  "/admin/obat/:id",
  authenticateToken,
  isAdmin,
  obatController.adminCRUDObat
);
//DELETE
router.delete(
  "/admin/obat/:id",
  authenticateToken,
  isAdmin,
  obatController.adminCRUDObat
);

// Routes untuk Pegawai
router.post(
  "/pegawai/obat",
  authenticateToken,
  isEmployee, // Pastikan Anda memiliki fungsi isEmployee yang ditentukan di middleware Anda
  obatController.pegawaiCRUDObat
);

// Routes untuk Pemilik
router.get(
  "/pemilik/obat",
  authenticateToken,
  isOwner,
  obatController.PemilikReadObat
);

export default router;
