import bcrypt from "bcryptjs";
import { generateToken } from "../../middlewares/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi login umum
const loginUser = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  console.log("Pengguna diambil dari database:", user); // Debugging

  if (!user) {
    throw new Error("Username atau password salah");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Username atau password salah");
  }

  const token = generateToken(user);
  console.log("Role pengguna:", user.jabatan);
  console.log("Token yang dihasilkan:", token);
  return {
    role: user.jabatan,
    user: {
      username: user.username,
      jabatan: user.jabatan,
      alamat: user.alamat,
      no_telp: user.no_telp,
      email: user.email,
    },
    token,
    expiresIn: "10800",
  };
};

// Handler untuk login
const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password harus diisi",
    });
  }

  try {
    const result = await loginUser(username, password); // Panggil loginUser
    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: result,
    });
  } catch (error) {
    console.error("Kesalahan saat login:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message || "Gagal untuk login",
    });
  }
};

// Fungsi pendaftaran umum
const registerUser = async (
  username,
  password,
  jabatan,
  alamat,
  no_telp,
  email
) => {
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new Error("Username sudah terdaftar");
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      jabatan,
      alamat,
      no_telp,
      email,
    },
  });

  return {
    username: newUser.username,
    jabatan: newUser.jabatan,
    alamat: newUser.alamat,
    no_telp: newUser.no_telp,
    email: newUser.email,
  };
};

// Handler untuk pendaftaran
const handleRegister = async (req, res) => {
  const { username, password, alamat, no_telp, email } = req.body;

  if (!username || !password || !alamat || !no_telp || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Semua kolom harus diisi" });
  }

  try {
    const jabatan = "pemilik"; // Jabatan default
    const userData = await registerUser(
      username,
      password,
      jabatan,
      alamat,
      no_telp,
      email
    );
    return res.status(201).json({ success: true, data: userData });
  } catch (error) {
    console.error("Kesalahan saat pendaftaran:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fungsi untuk mencari pengguna berdasarkan username, no_telp, atau email
const forgotUser = async (username, no_telp, email) => {
  const whereCondition = username
    ? { username }
    : no_telp
    ? { no_telp }
    : { email };

  console.log("Mencari pengguna dengan kondisi:", whereCondition); // Tambahkan log ini
  return await prisma.user.findFirst({ where: whereCondition });
};
// Handler untuk reset password
const handleForgotPassword = async (req, res) => {
  const { username, no_telp, email, newPassword } = req.body;

  // Validasi input
  if (!newPassword || (!username && !no_telp && !email)) {
    console.log(`Permintaan gagal: Field yang diperlukan tidak lengkap.`);
    return res.status(400).json({
      success: false,
      message: "Username, no_telp, email, dan password baru harus diisi",
    });
  }

  try {
    // Mencari pengguna berdasarkan detail yang diberikan
    const user = await forgotUser(username, no_telp, email);

    // Validasi pengguna ditemukan dan memiliki jabatan pemilik
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan atau detail tidak cocok",
      });
    }

    if (user.jabatan !== "pemilik") {
      return res.status(403).json({
        success: false,
        message:
          "Akses ditolak: hanya pengguna pemilik yang dapat mereset password",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id_user: user.id_user },
      data: { password: hashedPassword },
    });

    console.log(
      `Password berhasil diperbarui untuk pengguna: ${user.username}`
    );
    return res
      .status(200)
      .json({ success: true, message: "Password berhasil diperbarui" });
  } catch (error) {
    console.error("Kesalahan saat memperbarui password:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui password",
    });
  }
};

// Pemilik Register
const PemilikRegister = (req, res) => handleRegister(req, res);

// Pemilik Forgot Password
const PemilikForgotPassword = (req, res) => handleForgotPassword(req, res);

// Ekspor semua fungsi
export default {
  handleLogin,
  PemilikRegister,
  PemilikForgotPassword,
};
