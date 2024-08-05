import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Obat Controller
 * Mengelola CRUD operasi untuk entitas obat berdasarkan peran pengguna.
 */
const obatController = {
  /**
   * Admin CRUD Obat
   * Mengelola operasi CRUD untuk admin.
   *
   * @param {Object} req - Objek permintaan Express.
   * @param {Object} res - Objek respon Express.
   * @returns {Object} JSON - Hasil operasi CRUD atau pesan kesalahan.
   */
  adminCRUDObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran admin
      const { user } = req;
      if (user.jabatan !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          result = await prisma.obat.create({
            data: {
              id_obat: data.id_obat,
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

  /**
   * Pegawai CRUD Obat
   * Mengelola operasi CRUD untuk pegawai.
   *
   * @param {Object} req - Objek permintaan Express.
   * @param {Object} res - Objek respon Express.
   * @returns {Object} JSON - Hasil operasi CRUD atau pesan kesalahan.
   */
  pegawaiCRUDObat: async (req, res) => {
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
      console.log("Data diterima:", data);
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

  /**
   * Pemilik Read Obat
   * Mengelola operasi baca untuk pemilik.
   *
   * @param {Object} req - Objek permintaan Express.
   * @param {Object} res - Objek respon Express.
   * @returns {Object} JSON - Hasil operasi baca atau pesan kesalahan.
   */
  pemilikReadObat: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      console.log("Received action:", action); // Log action
      let result;

      if (action === "read") {
        result = await prisma.obat.findMany();
      } else {
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
