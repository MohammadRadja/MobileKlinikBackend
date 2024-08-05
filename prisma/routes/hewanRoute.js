import express from "express";
import {
  authenticateToken,
  isAdmin,
  isEmployee,
  isOwner,
} from "../middlewares/authMiddleware.js";
import hewanController from "../controllers/hewanController.js";

const router = express.Router();

// Middleware untuk logging HTTP request
const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

/* Routes untuk Admin */
// POST -> CREATE
router.post(
  "/admin/hewan",
  logRequest,
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);

// GET - READ
router.get(
  "/admin/hewan",
  logRequest,
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan,
  (req, res) => {
    console.log("Admin GET /admin/hewan");
    res.json({ message: "Data hewan berhasil diambil" });
  }
);

// PUT -> EDIT
router.put(
  "/admin/hewan/:id",
  logRequest,
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);

// DELETE
router.delete(
  "/admin/hewan/:id",
  logRequest,
  authenticateToken,
  isAdmin,
  hewanController.adminCRUDHewan
);

/* Routes untuk Pegawai */
// POST -> CREATE
router.post(
  "/pegawai/hewan",
  logRequest,
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);

// GET - READ
router.post(
  "/pegawai/hewan",
  logRequest,
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);

// PUT -> EDIT
router.put(
  "/pegawai/hewan/:id",
  logRequest,
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);

// DELETE
router.delete(
  "/pegawai/hewan/:id",
  logRequest,
  authenticateToken,
  isEmployee,
  hewanController.pegawaiCRUDHewan
);

/* Routes untuk Pemilik */
// GET - READ
router.post(
  "/pemilik/hewan",
  logRequest,
  authenticateToken,
  isOwner,
  hewanController.pemilikCRUDHewan
);
export default router;
