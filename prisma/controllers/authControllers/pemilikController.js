import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PemilikRegister = async (req, res) => {
  const { username, password, jabatan, alamat, no_telp } = req.body;

  if (!username || !password || !jabatan || !alamat || !no_telp) {
    res.status(400).json({
      success: false,
      message: "username, password, jabatan, alamat and no_telp are required",
    });
    return;
  }
  const existUsername = await prisma.pemilik.findFirst({
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
    const pemilik = await prisma.pemilik.create({
      data: {
        username,
        password: hash,
        jabatan,
        alamat,
        no_telp,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        username: pemilik.username,
        password: pemilik.password,
        jabatan: pemilik.jabatan,
        alamat: pemilik.alamat,
        no_telp: pemilik.no_telp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const PemilikLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    const pemilik = await prisma.pemilik.findFirst({
      where: {
        username: username,
      },
    });

    if (!pemilik) {
      return res.status(401).json({
        success: false,
        message: "username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, pemilik.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "username or password is incorrect",
      });
    }

    const token = generateToken(pemilik);
    return res.status(200).json({
      success: true,
      data: {
        role: "pemilik",
        id_pemilik: pemilik.id_pemilik,
        user: {
          username: pemilik.username,
          jabatan: pemilik.jabatan,
          alamat: pemilik.alamat,
          no_telp: pemilik.no_telp,
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

const PemilikForgotPassword = async (req, res) => {
  const { username, no_telp, newPassword } = req.body;

  if (!newPassword || (!username && !no_telp)) {
    console.log(
      `Request failed: Missing fields. Username: ${username}, No Telp: ${no_telp}, New Password: ${newPassword}`,
    );
    return res.status(400).json({
      success: false,
      message: "Username or no_telp and newPassword are required",
    });
  }

  try {
    const whereCondition = username
      ? { username: username }
      : { no_telp: no_telp };

    console.log(
      `Searching for user with ${
        username ? "Username: " + username : "No Telp: " + no_telp
      }`,
    );
    const pemilik = await prisma.pemilik.findFirst({ where: whereCondition });

    if (!pemilik) {
      console.log(
        `User not found or incorrect details. ${
          username ? "Username: " + username : "No Telp: " + no_telp
        }`,
      );
      return res.status(404).json({
        success: false,
        message: "User not found or incorrect details",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(
      `Password hashed successfully for ${
        username ? "Username: " + username : "No Telp: " + no_telp
      }`,
    );

    await prisma.pemilik.update({
      where: { id_pemilik: pemilik.id_pemilik },
      data: { password: hashedPassword },
    });

    console.log(
      `Password updated successfully for ${
        username ? "Username: " + username : "No Telp: " + no_telp
      }`,
    );
    return res.status(200).json({
      success: true,
      message: "Password successfully updated",
    });
  } catch (error) {
    console.error("Error updating password:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password",
    });
  }
};

export default { PemilikRegister, PemilikLogin, PemilikForgotPassword };
