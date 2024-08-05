import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import dokterController from "../controllers/dokterController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/dokter",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter,
);
//GET -> READ
router.post(
  "/admin/dokter",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter,
);
//PUT -> UPDATE
router.put(
  "/admin/dokter/:id",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter,
);
//DELETE
router.delete(
  "/admin/dokter/:id",
  authenticateToken,
  isAdmin,
  dokterController.adminCRUDDokter,
);

// Routes untuk Pegawai
//POST -> CREATE
router.post(
  "/pegawai/dokter",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter,
);
//GET -> READ
router.get(
  "/pegawai/dokter",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter,
);
//PUT -> UPDATE
router.put(
  "/pegawai/dokter/:id",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter,
);
//DELETE
router.delete(
  "/pegawai/dokter/:id",
  authenticateToken,
  isEmployee,
  dokterController.pegawaiCRUDDokter,
);

// Routes untuk Pemilik
router.post(
  "/pemilik/dokter",
  authenticateToken,
  isOwner,
  dokterController.pemilikReadDokter,
);

export default router;
