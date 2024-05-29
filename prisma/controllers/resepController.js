// controllers/resepController.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resepController = {
  // Admin: CRUD semua tabel
  adminCRUDResep: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { tableName } = req;
      if (tableName !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.resep.create({
            data: {
              jumlah_obat: data.jumlah_obat,
            },
          });
          break;
        case "read":
          result = await prisma.resep.findMany();
          break;
        case "update":
          result = await prisma.resep.update({
            where: { id_resep: data.id_resep },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.resep.delete({
            where: { id_resep: data.id_resep },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDResep: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { tableName } = req;
      if (tableName !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.resep.create({
            data: {
              jumlah_obat: data.jumlah_obat,
            },
          });
          break;
        case "read":
          result = await prisma.resep.findMany();
          break;
        case "update":
          result = await prisma.resep.update({
            where: { id_resep: data.id_resep },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.resep.delete({
            where: { id_resep: data.id_resep },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadResep: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { tableName } = req;
      if (tableName !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.resep.findMany();
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: action, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default resepController;
