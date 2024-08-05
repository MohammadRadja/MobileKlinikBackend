// controllers/resepController.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resepController = {
  // Admin: CRUD semua tabel
  adminCRUDResep: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "create":
          try {
            result = await prisma.resep.create({
              data: {
                id_user: data.id_user,
                id_rekam_medis: data.id_rekam_medis,
                id_obat: data.id_obat,
                jumlah_obat: data.jumlah_obat,
              },
            });
            return res.status(201).json({ success: true, data: result }); // Return here to stop execution
          } catch (error) {
            if (error.code === "P2002") {
              return res.status(400).json({
                success: false,
                message: "Resep dengan id_rekam_medis ini sudah ada.",
              });
            }
            return res.status(500).json({
              success: false,
              message: "Terjadi kesalahan pada server: " + error.message,
            });
          }

        case "read":
          try {
            result = await prisma.resep.findMany({
              orderBy: {
                id_resep: "asc",
              },
              select: {
                id_resep: true,
                id_user: true,
                user: {
                  select: {
                    username: true,
                  },
                },
                rekam_medis: {
                  select: {
                    keluhan: true,
                  },
                },
                id_obat: true,
                obat: {
                  select: {
                    nama_obat: true,
                  },
                },
                jumlah_obat: true,
              },
            });
            return res.status(200).json({ success: true, data: result }); // Return here to stop execution
          } catch (error) {
            return res
              .status(500)
              .json({ success: false, message: "Failed to read resep." });
          }

        case "update":
          if (!data.id_resep) {
            return res
              .status(400)
              .json({ success: false, message: "Missing id_resep" });
          }
          try {
            result = await prisma.resep.update({
              where: { id_resep: data.id_resep },
              data: {
                id_user: data.id_user,
                id_rekam_medis: data.id_rekam_medis,
                id_obat: data.id_obat,
                jumlah_obat: data.jumlah_obat,
              },
            });
            return res.status(200).json({ success: true, data: result }); // Return after sending response
          } catch (error) {
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }

        case "delete":
          try {
            result = await prisma.resep.delete({
              where: { id_resep: data.id_resep },
            });
            return res
              .status(200)
              .json({ success: true, message: "Resep deleted successfully." }); // Return after sending response
          } catch (error) {
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDResep: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "create":
          try {
            result = await prisma.resep.create({
              data: {
                id_user: data.id_user,
                id_rekam_medis: data.id_rekam_medis,
                id_obat: data.id_obat,
                jumlah_obat: data.jumlah_obat,
              },
            });
            res.status(201).json({ success: true, data: result });
          } catch (error) {
            if (error.code === "P2002") {
              return res.status(400).json({
                success: false,
                message: "Resep dengan id_rekam_medis ini sudah ada.",
              });
            }
            return res.status(500).json({
              success: false,
              message: "Terjadi kesalahan pada server: " + error.message,
            });
          }
          break;

        case "read":
          try {
            result = await prisma.resep.findMany({
              orderBy: {
                id_resep: "asc",
              },
              select: {
                id_resep: true,
                id_user: true,
                user: {
                  select: {
                    username: true,
                  },
                },
                rekam_medis: {
                  select: {
                    keluhan: true,
                  },
                },
                id_obat: true,
                obat: {
                  select: {
                    nama_obat: true,
                  },
                },
                jumlah_obat: true,
              },
            });
            return res.status(200).json({ success: true, data: result });
          } catch (error) {
            return res
              .status(500)
              .json({ success: false, message: "Failed to read resep." });
          }
          break;

        case "update":
          if (!data.id_resep) {
            return res
              .status(400)
              .json({ success: false, message: "Missing id_resep" });
          }
          try {
            result = await prisma.resep.update({
              where: { id_resep: data.id_resep },
              data: {
                id_user: data.id_user,
                id_rekam_medis: data.id_rekam_medis,
                id_obat: data.id_obat,
                jumlah_obat: data.jumlah_obat,
              },
            });
          } catch (error) {
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }
          break;

        case "delete":
          try {
            result = await prisma.resep.delete({
              where: { id_resep: data.id_resep },
            });
          } catch (error) {
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  // Pemilik: Hanya dapat melihat data
  pemilikReadResep: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPemilik = user.id_user; // Ambil id_user dari user
      const { action } = req.body; // Hanya ambil action

      if (action !== "read") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid action" });
      }

      // Mencoba mengambil data resep
      const result = await prisma.resep.findMany({
        where: { id_user: idPemilik },
        orderBy: { id_resep: "asc" },
        select: {
          id_resep: true,
          id_user: true,
          user: { select: { username: true } },
          rekam_medis: { select: { keluhan: true } },
          id_obat: true,
          obat: { select: { nama_obat: true } },
          jumlah_obat: true,
        },
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error get data resep from pemilik:", error); // Log error untuk debug
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to get resep from pemilik: " + error.message,
        });
    }
  },
};

export default resepController;
