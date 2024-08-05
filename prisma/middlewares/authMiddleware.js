import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config();

export const generateToken = (user) => {
  console.log("User:", user);
  return jwt.sign(
    {
      id: user.id_user,
      username: user.username,
      role: user.jabatan,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h", // 3 hours
    }
  );
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Bearer token is required");
    return res
      .status(401)
      .json({ success: false, message: "Bearer token is required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await prisma.user.findUnique({
      where: {
        id_user: decoded.id,
      },
    });

    if (!user) {
      console.error(`No user found with id: ${decoded.id}`);
      return res.status(403).json({ success: false, message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in token verification:", error);
    return res.status(403).json({ success: false, message: "Token invalid" });
  }
};
/* 
Admin
*/
export const isAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || !user.jabatan) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  console.log("User role in isAdmin:", user.jabatan); // Logging role

  if (user.jabatan !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Admin Access Only. User is not authorized as admin.",
    });
  }
  next();
};

/* 
Pegawai
*/
export const isEmployee = (req, res, next) => {
  const user = req.user;

  // Pastikan req.user dan req.user.role tidak undefined atau null
  if (!user || !user.jabatan) {
    return res
      .status(403)
      .json({ message: "Forbidden: Pegawai access required" });
  }

  console.log("User role in isEmployee:", user.jabatan); // Logging role

  if (user.jabatan !== "pegawai") {
    return res.status(401).json({
      success: false,
      message: "Pegawai Access Only. User is not authorized as Pegawai.",
    });
  }

  // Jika semua validasi berhasil, lanjutkan ke middleware atau handler berikutnya
  next();
};
/* 
Pemilik
*/
export const isOwner = (req, res, next) => {
  const user = req.user;

  // Pastikan req.user dan req.user.jabatan tidak undefined atau null
  if (!user || !user.jabatan) {
    return res
      .status(403)
      .json({ message: "Forbidden: Pemilik access required" });
  }

  console.log("User jabatan in isOwner:", user.jabatan); // Logging role

  if (user.jabatan !== "pemilik") {
    return res.status(401).json({
      success: false,
      message: "Pemilik Access Only. User is not authorized as Pemilik.",
    });
  }

  // Jika semua validasi berhasil, lanjutkan ke middleware atau handler berikutnya
  next();
};
