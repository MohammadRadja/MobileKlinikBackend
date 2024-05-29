import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AdminRegister = async (req, res) => {
  const { nama, username, password } = req.body;

  if (!nama || !username || !password) {
    res.status(400).json({
      success: false,
      message: "name, username and password are required",
    });
    return;
  }
  const existUsername = await prisma.admin.findFirst({
    where: {
      username: username,
    },
  });
  if (existUsername) {
    res.status(400).json({
      success: false,
      message: "username already exist",
    });
    return;
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.admin.create({
      data: {
        nama,
        username,
        password: hash,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        nama: user.nama,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const AdminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "username and password are required",
    });
    return;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      username,
    },
  });

  if (!admin) {
    res.status(401).json({
      success: false,
      message: "username or password is incorrect",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "username or password is incorrect",
    });
    return;
  }

  const token = generateToken(admin);
  res.status(200).json({
    success: true,
    data: {
      admin: {
        nama: admin.nama,
        username: admin.username,
      },

      token,
      expiresIn: "10800",
    },
  });
};

export default { AdminRegister, AdminLogin };
