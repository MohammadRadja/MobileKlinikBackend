import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AdminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    const token = generateToken(admin);

    console.log(`Admin logged in successfully: ${admin.username}`);

    return res.status(200).json({
      success: true,
      data: {
        role: "admin",
        user: {
          nama: admin.nama,
          username: admin.username,
          jabatan: admin.jabatan,
        },
        token,
        expiresIn: "10800",
      },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default { AdminLogin };
