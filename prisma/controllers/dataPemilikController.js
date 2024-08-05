import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

const dataPemilikController = {
  adminCRUDDataPemilik: async (req, res) => {
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
              jabatan: "pemilik",
            },
            orderBy: {
              id_user: "asc", // Urutkan berdasarkan id_pemilik dalam urutan naik (ascending)
            },
          });
          break;

        case "update":
          try {
            // Cek apakah username sudah ada
            const usernameExist = await prisma.user.findFirst({
              where: {
                username: data.username,
                id_user: { not: data.id_user }, // Pastikan tidak mengecek username yang sama dengan pengguna yang sedang diperbarui
              },
            });

            if (usernameExist) {
              return res.status(400).json({
                success: false,
                message: "Username Pegawai already exists",
              });
            }
            const result = await prisma.user.update({
              where: { id_user: data.id_user },
              data: { ...data },
            });
            return res.status(200).json({
              success: true,
              message: "Update Pegawai Sukses",
              data: result,
            });
          } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          break;

        case "delete":
          result = await prisma.user.deleteMany({
            where: { id_user: data.id_user },
          });
          console.log("Delete Pemilik - Response status: 200");
          console.log("Delete Pemilik - Response body:", result);

          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Pemilik from Admin - Response status: 500");
      console.error("CRUD Pemilik from Admin - Response body:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai dapat CRUD semua data kecuali tabel admin
  pegawaiCRUDDataPemilik: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { user } = req;
      if (user.jabatan !== "pegawai") {
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
              jabatan: "pemilik",
            },
            orderBy: {
              id_user: "asc", // Urutkan berdasarkan id_pemilik dalam urutan naik (ascending)
            },
          });
          break;

        case "update":
          try {
            // Cek apakah username sudah ada
            const usernameExist = await prisma.user.findFirst({
              where: {
                username: data.username,
                id_user: { not: data.id_user }, // Pastikan tidak mengecek username yang sama dengan pengguna yang sedang diperbarui
              },
            });

            if (usernameExist) {
              return res.status(400).json({
                success: false,
                message: "Username Pegawai already exists",
              });
            }
            const result = await prisma.user.update({
              where: { id_user: data.id_user },
              data: { ...data },
            });
            return res.status(200).json({
              success: true,
              message: "Update Pegawai Sukses",
              data: result,
            });
          } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          break;

        case "delete":
          result = await prisma.user.deleteMany({
            where: { id_user: data.id_user },
          });
          console.log("Delete Pemilik - Response status: 200");
          console.log("Delete Pemilik - Response body:", result);

          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Pemilik from Admin - Response status: 500");
      console.error("CRUD Pemilik from Admin - Response body:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik hanya dapat melihat data
  pemilikCRUDDataPemilik: async (req, res) => {
    try {
      const { user } = req;
      console.log("User:", user);
      console.log("User jabatan:", user.jabatan);
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPemilik = user.id_user || ""; // Replace with appropriate logic if needed
      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      console.log("ID pemilik yang digunakan:", idPemilik);
      let result;

      switch (action) {
        case "read":
          console.log("GET ID Pemilik:", idPemilik);
          result = await prisma.user.findUnique({
            where: { id_user: idPemilik },
          });
          if (!result) {
            console.log("ID Pemilik tidak ditemukan:", idPemilik);
            return res
              .status(404)
              .json({ success: false, message: "Pemilik tidak ditemukan." });
          }
          break;

        case "update":
          console.log("Updating data for pemilik ID:", idPemilik);
          if (!data) {
            console.log("Missing data to update in request body:", data);
            return res
              .status(400)
              .json({ success: false, message: "Data pemilik tidak lengkap." });
          }

          console.log("Data sebelum update:", data);
          const { password, ...updateData } = data;

          // Hash password jika ada
          if (password) {
            updateData.password = await bcrypt.hash(password, 10);
          }

          try {
            // Update data
            result = await prisma.user.update({
              where: { id_user: idPemilik }, // Menggunakan idPemilik
              data: { ...updateData },
            });
            console.log("Update successful:", result);
          } catch (updateError) {
            return res
              .status(500)
              .json({ success: false, message: "Update failed." });
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in pemilikCRUDDataPemilik:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dataPemilikController;
