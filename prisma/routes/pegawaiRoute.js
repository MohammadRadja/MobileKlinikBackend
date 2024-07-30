import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import dataPegawaiController from "../controllers/dataPegawaiController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/pegawai",
  authenticateToken,
  isAdmin,
  dataPegawaiController.adminCRUDDataPegawai
);
//GET -> READ
router.get(
  "/admin/pegawai",
  authenticateToken,
  isAdmin,
  dataPegawaiController.adminCRUDDataPegawai
);
//PUT -> UPDATE
router.put(
  "/admin/pegawai/:id",
  authenticateToken,
  isAdmin,
  dataPegawaiController.adminCRUDDataPegawai
);
//DELETE
router.delete(
  "/admin/pegawai/:id",
  authenticateToken,
  isAdmin,
  dataPegawaiController.adminCRUDDataPegawai
);

// Routes untuk Pegawai
//GET -> READ
router.post(
  "/pegawai/pegawai/:id",
  authenticateToken,
  isEmployee,
  dataPegawaiController.pegawaiCRUDDataPegawai
);
//PUT -> UPDATE
router.put(
  "/pegawai/pegawai/:id",
  authenticateToken,
  isEmployee,
  dataPegawaiController.pegawaiCRUDDataPegawai
);

// Routes untuk Pemilik
//GET -> READ
router.post(
  "/pemilik/pegawai",
  authenticateToken,
  isOwner,
  dataPegawaiController.PemilikReadPegawai
);
export default router;
