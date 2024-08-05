// routes/rekamMedisRoutes.js

import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import rekamMedisController from "../controllers/rekammedisController.js";

const router = express.Router();

/* Routes untuk Admin */
//POST -> CREATE
router.post(
  "/admin/rekammedis",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);
//GET -> READ
router.post(
  "/admin/rekammedis",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);
//PUT -> UPDATE
router.put(
  "/admin/rekammedis/:id",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);
//DELETE
router.delete(
  "/admin/rekammedis/:id",
  authenticateToken,
  isAdmin,
  rekamMedisController.adminCRUDRekamMedis
);

/* Routes untuk Pegawai */
//POST -> CREATE
router.post(
  "/pegawai/rekammedis",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);
//GET -> READ
router.post(
  "/pegawai/rekammedis",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);
//PUT -> UPDATE
router.put(
  "/pegawai/rekammedis/:id",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);
//DELETE
router.delete(
  "/pegawai/rekammedis/:id",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);

// Routes untuk Pemilik
router.post(
  "/pemilik/rekammedis",
  authenticateToken,
  isOwner,
  rekamMedisController.pemilikReadRekamMedis
);
//PUT -> UPDATE
router.put(
  "/pemilik/rekammedis/:id",
  authenticateToken,
  isEmployee,
  rekamMedisController.pegawaiCRUDRekamMedis
);
export default router;
