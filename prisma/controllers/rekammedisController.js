import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rekammedisController = {
  // Admin: CRUD semua tabel
  adminCRUDRekamMedis: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { role } = req.user;
      if (role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.rekammedis.create({
            data: {
              id_hewan: data.id_hewan,
              id_pemilik: data.id_pemilik,
              id_pegawai: data.id_pegawai,
              id_obat: data.id_obat,
              keluhan: data.keluhan,
              diagnosa: data.diagnosa,
              tgl_periksa: data.tgl_periksa,
            },
          });
          break;
        case "read":
          result = await prisma.rekammedis.findMany();
          break;
        case "update":
          result = await prisma.rekammedis.update({
            where: { id_rekam_medis: data.id_rekam_medis },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.hewan.delete({
            where: { id_rekam_medis: data.id_rekam_medis },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDRekamMedis: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { role } = req.user;
      if (role !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.rekammedis.create({
            data: {
              id_hewan: data.id_hewan,
              id_pemilik: data.id_pemilik,
              id_pegawai: data.id_pegawai,
              id_obat: data.id_obat,
              keluhan: data.keluhan,
              diagnosa: data.diagnosa,
              tgl_periksa: data.tgl_periksa,
            },
          });
          break;
        case "read":
          result = await prisma.rekammedis.findMany();
          break;
        case "update":
          result = await prisma.rekammedis.update({
            where: { id_rekam_medis: data.id_rekam_medis },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.hewan.delete({
            where: { id_rekam_medis: data.id_rekam_medis },
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadRekamMedis: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { role } = req.user;
      if (role !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.rekammedis.findMany();
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default rekammedisController;
