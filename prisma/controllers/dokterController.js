import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola data Dokter
 */
const dokterController = {
  /**
   * Admin: Melakukan operasi CRUD pada data Dokter
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  adminCRUDDokter: async (req, res) => {
    try {
      const { user } = req;
      console.log("User object:", user);

      // Memastikan user memiliki peran admin
      console.log("User jabatan:", user.jabatan);
      if (user.jabatan !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Data diterima:", req.body);

      let result;

      switch (action) {
        case "create":
          try {
            // Cek apakah nama dokter sudah ada
            const existingDoctor = await prisma.dokter.findFirst({
              where: {
                nama_dokter: data.nama_dokter,
              },
            });

            if (existingDoctor) {
              return res.status(400).json({
                success: false,
                message: "Nama dokter sudah ada",
              });
            }

            // Proses pembuatan data Dokter baru
            const result = await prisma.dokter.create({
              data: {
                nama_dokter: data.nama_dokter,
                spesialisasi: data.spesialisasi,
              },
            });

            return res.status(200).json({
              success: true,
              message: "Dokter berhasil dibuat",
              data: result,
            });
          } catch (error) {
            console.error("Gagal Tambah Data Dokter:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          break;

        case "read":
          try {
            // Mengambil semua data Dokter
            const result = await prisma.dokter.findMany({
              orderBy: {
                id_dokter: "asc",
              },
            });

            return res.status(200).json({
              success: true,
              message: "Data dokter berhasil diambil",
              data: result,
            });
          } catch (error) {
            console.error("Gagal Ambil Data Dokter:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          break;

        case "update":
          try {
            // Cek apakah nama dokter sudah ada kecuali untuk dokter yang sedang diupdate
            const existingDoctor = await prisma.dokter.findFirst({
              where: {
                nama_dokter: data.nama_dokter,
                NOT: { id_dokter: data.id_dokter }, // Cek kecuali untuk ID yang sama
              },
            });

            if (existingDoctor) {
              return res.status(400).json({
                success: false,
                message: "Nama dokter sudah ada",
              });
            }

            // Memperbarui data Dokter yang ada
            const result = await prisma.dokter.update({
              where: { id_dokter: data.id_dokter },
              data: { ...data }, // Data yang diperbarui
            });

            return res.status(200).json({
              success: true,
              message: "Dokter berhasil diupdate",
              data: result,
            });
          } catch (error) {
            console.error("Gagal Update Data Dokter:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          break;

        case "delete":
          try {
            // Menghapus data Dokter berdasarkan ID
            const result = await prisma.dokter.delete({
              where: { id_dokter: data.id_dokter },
            });

            return res.status(200).json({
              success: true,
              message: "Dokter berhasil dihapus",
              data: result,
            });
          } catch (error) {
            console.error("Gagal Hapus Data Dokter:", error);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in adminCRUDDokter:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pegawai: Melakukan operasi CRUD pada data Dokter, kecuali admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  pegawaiCRUDDokter: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran pegawai
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Data diterima:", data);

      let result;

      switch (action) {
        case "create":
          // Proses pembuatan data Dokter baru
          result = await prisma.dokter.create({
            data: {
              nama_dokter: data.nama_dokter,
              spesialisasi: data.spesialisasi,
            },
          });
          break;

        case "read":
          // Mengambil semua data Dokter
          result = await prisma.dokter.findMany({
            orderBy: {
              id_dokter: "asc",
            },
          });
          break;

        case "update":
          // Memperbarui data Dokter yang ada
          result = await prisma.dokter.update({
            where: { id_dokter: data.id_dokter },
            data: { ...data },
          });
          break;

        case "delete":
          // Menghapus data Dokter berdasarkan ID
          result = await prisma.dokter.delete({
            where: { id_dokter: data.id_dokter },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in pegawaiCRUDDokter:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pemilik: Hanya dapat melihat data Dokter
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  pemilikReadDokter: async (req, res) => {
    try {
      const { user } = req;

      // Memastikan user memiliki peran pemilik
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action } = req.body;
      console.log("Received action:", action);

      let result;

      switch (action) {
        case "read":
          // Mengambil semua data Dokter
          result = await prisma.dokter.findMany({
            orderBy: {
              id_dokter: "asc",
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
      console.error("Error in pemilikReadDokter:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default dokterController;
