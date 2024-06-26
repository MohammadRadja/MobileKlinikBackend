import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const obatController = {
  // Admin dapat CRUD semua data
  adminCRUDObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { jabatan_admin } = req;
      if (jabatan_admin !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.obat.create({
            data: {
              nama_obat: data.nama_obat,
              keterangan: data.keterangan,
            },
          });
          break;
        case "read":
          (action = read), (result = await prisma.obat.findMany());
          break;
        case "update":
          result = await prisma.obat.update({
            where: { id_obat: data.id_obat },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.obat.delete({
            where: { id_obat: data.id_obat },
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

  // Pegawai dapat CRUD semua data kecuali tabel admin
  pegawaiCRUDObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
      const { jabatan_pegawai } = req;
      if (jabatan_pegawai !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "create":
          result = await prisma.obat.create({
            data: {
              nama_obat: data.nama_obat,
              keterangan: data.keterangan,
            },
          });
          break;
        case "read":
          result = await prisma.obat.findMany();
          break;
        case "update":
          result = await prisma.obat.update({
            where: { id_obat: data.id_obat },
            data: { ...data },
          });
          break;
        case "delete":
          result = await prisma.obat.delete({
            where: { id_obat: data.id_obat },
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

  // Pemilik hanya dapat melihat data
  PemilikReadObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { jabatan_pemilik } = req;
      if (jabatan_pemilik !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;
      switch (action) {
        case "read":
          result = await prisma.obat.findMany();
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

export default obatController;
