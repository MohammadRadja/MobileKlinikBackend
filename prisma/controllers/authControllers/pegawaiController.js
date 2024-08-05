import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Login
const PegawaiLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    const pegawai = await prisma.pegawai.findFirst({
      where: {
        username: username,
      },
    });

    if (!pegawai) {
      return res.status(401).json({
        success: false,
        message: "username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, pegawai.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "username or password is incorrect",
      });
    }

    const token = generateToken(pegawai);
    return res.status(200).json({
      success: true,
      data: {
        role: "pegawai",
        pegawai: {
          username: pegawai.username,
          jabatan: pegawai.jabatan,
          alamat: pegawai.alamat,
          no_telp: pegawai.no_telp,
        },
        token,
        expiresIn: "10800",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

export default { PegawaiLogin };
