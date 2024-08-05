import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import pembayaranController from "../controllers/pembayaranController.js";

const router = express.Router();

/* Routes untuk Admin */
//POST -> CREATE
router.post(
  "/admin/pembayaran",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);
//GET -> READ
router.get(
  "/admin/pembayaran",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);
//PUT -> UPDATE
router.put(
  "/admin/pembayaran/:id",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);
//DELETE
router.delete(
  "/admin/pembayaran/:id",
  authenticateToken,
  isAdmin,
  pembayaranController.adminCRUDPembayaran
);

/* Routes untuk Pegawai */
//POST -> CREATE
router.post(
  "/pegawai/pembayaran",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);
//GET -> READ
router.get(
  "/pegawai/pembayaran",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);
//PUT -> UPDATE
router.put(
  "/pegawai/pembayaran/:id",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);
//DELETE
router.delete(
  "/pegawai/pembayaran/:id",
  authenticateToken,
  isEmployee,
  pembayaranController.pegawaiCRUDPembayaran
);

/* Routes untuk Pemilik */
router.post(
  "/pemilik/pembayaran",
  authenticateToken,
  isOwner,
  pembayaranController.pemilikReadPembayaran
);

export default router;
