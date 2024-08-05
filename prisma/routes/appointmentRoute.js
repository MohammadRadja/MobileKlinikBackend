import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

// Routes untuk Admin
//POST -> CREATE
router.post(
  "/admin/appointment",
  authenticateToken,
  isAdmin,
  appointmentController.adminCRUDAppointment
);
//GET -> READ
router.get(
  "/admin/appointment",
  authenticateToken,
  isAdmin,
  appointmentController.adminCRUDAppointment
);
//PUT -> UPDATE
router.put(
  "/admin/appointment/:id",
  authenticateToken,
  isAdmin,
  appointmentController.adminCRUDAppointment
);
//DELETE
router.delete(
  "/admin/appointment/:id",
  authenticateToken,
  isAdmin,
  appointmentController.adminCRUDAppointment
);

// Routes untuk Pegawai
//POST -> CREATE
router.post(
  "/pegawai/appointment",
  authenticateToken,
  isEmployee,
  appointmentController.pegawaiCRUDAppointment
);
//GET -> READ
router.post(
  "/pegawai/appointment",
  authenticateToken,
  isEmployee,
  appointmentController.pegawaiCRUDAppointment
);
//PUT -> UPDATE
router.put(
  "/pegawai/appointment/:id",
  authenticateToken,
  isEmployee,
  appointmentController.pegawaiCRUDAppointment
);
//DELETE
router.delete(
  "/pegawai/appointment/:id",
  authenticateToken,
  isEmployee,
  appointmentController.pegawaiCRUDAppointment
);

// Routes untuk Pemilik
router.post(
  "/pemilik/appointment",
  authenticateToken,
  isOwner,
  appointmentController.pemilikCRUDAppointment
);
//PUT -> UPDATE
router.put(
  "/pemilik/appointment/:id",
  authenticateToken,
  isOwner,
  appointmentController.pemilikCRUDAppointment
);
//DELETE
router.delete(
  "/pemilik/appointment/:id",
  authenticateToken,
  isOwner,
  appointmentController.pemilikCRUDAppointment
);

export default router;
