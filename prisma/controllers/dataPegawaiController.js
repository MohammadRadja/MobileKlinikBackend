import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const dataPegawaiController = {
  adminCRUDDataPegawai: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.jabatan !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;

      switch (action) {
        case "create":
          const existUsername = await prisma.user.findFirst({
            where: {
              username: data.username,
            },
          });
          if (existUsername) {
            res.status(400).json({
              success: false,
              message: "Username Pegawai already exist",
            });
            return;
          }
          const hash = await bcrypt.hash(data.password, 10);
          result = await prisma.user.create({
            data: {
              username: data.username,
              password: hash,
              jabatan: data.jabatan,
              alamat: data.alamat,
              no_telp: data.no_telp,
              email: data.email,
            },
          });
          break;

        case "read":
          result = await prisma.user.findMany({
            where: {
              jabatan: "pegawai",
            },
            orderBy: {
              id_user: "asc",
            },
          });
          break;

        case "update":
          // Cek apakah password perlu dihash
          let updateData = { ...data };
          if (data.password) {
            const hash = await bcrypt.hash(data.password, 10);
            updateData.password = hash; // Mengupdate password yang sudah dihash
          }

          result = await prisma.user.update({
            where: { id_user: data.id_user },
            data: updateData,
          });
          console.log("Update Pegawai - Response status: 200");
          console.log("Update Pegawai - Response body:", result);
          break;

        case "delete":
          result = await prisma.user.delete({
            where: { id_user: data.id_user },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Pegawai from Admin - Response status: 500");
      console.error("CRUD Pegawai from Admin - Response body:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai dapat CRUD semua data kecuali tabel admin
  pegawaiCRUDDataPegawai: async (req, res) => {
    console.log("Request received:", req.method, req.path);
    try {
      const { user } = req;
      console.log("User:", user);
      console.log("User jabatan:", user.jabatan);
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPegawai = user.id_user || ""; // Replace with appropriate logic if needed
      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      console.log("ID Pegawai yang digunakan:", idPegawai);
      let result;

      switch (action) {
        case "read":
          console.log("GET ID Pegawai:", idPegawai);
          result = await prisma.user.findUnique({
            where: { id_user: idPegawai },
          });
          if (!result) {
            console.log("ID Pegawai tidak ditemukan:", idPemilik);
            return res
              .status(404)
              .json({ success: false, message: "Pegawai tidak ditemukan." });
          }
          break;

        case "update":
          console.log("Updating data for Pegawai ID:", idPegawai);
          if (!data) {
            console.log("Missing data to update in request body:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data Pegawai tidak lengkap." });
          }

          const { id_user, password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          result = await prisma.user.update({
            where: { id_user: idPegawai },
            data: { ...updateData },
          });
          console.log("Update successful:", result);
          break;

        default:
          console.log("Invalid action received:", action);
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik dapat READ data pegawai
  PemilikReadPegawai: async (req, res) => {
    console.log("Request received:", req.method, req.path);
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data); //
      let result;

      switch (action) {
        case "read":
          result = await prisma.pegawai.findMany({
            orderBy: {
              id_user: "asc", // Urutkan berdasarkan id_pemilik dalam urutan naik (ascending)
            },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Read Pegawai from pemilik - Response status: 500");
      console.error(
        "Read Pegawai from pemilik - Response body:",
        error.message,
      );
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataPegawaiController;
