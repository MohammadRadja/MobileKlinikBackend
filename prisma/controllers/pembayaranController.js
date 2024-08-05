import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Fungsi untuk mengonversi format tanggal DD-MM-YYYY ke ISO-8601
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Format tanggal tidak valid: ${dateStr}`);
  }
  date.setUTCHours(0, 0, 0, 0); // Mengatur waktu ke 00:00:00 UTC
  return date.toISOString();
};

// Fungsi untuk memformat tanggal ke DD-MM-YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Fungsi untuk menghubungkan data pembayaran
const connectData = (data) => ({
  rekam_medis: { connect: { id_rekam_medis: data.id_rekam_medis } },
  user: { connect: { id_user: data.id_user } },
  hewan: { connect: { id_hewan: data.id_hewan } },
  dokter: { connect: { id_dokter: data.id_dokter } },
  appointment: { connect: { id_appointment: data.id_appointment } },
  obat: { connect: { id_obat: data.id_obat } },
  resep: { connect: { id_resep: data.id_resep } },
  tgl_pembayaran: parseDate(data.tgl_pembayaran),
  jumlah_pembayaran: data.jumlah_pembayaran,
});

// Fungsi untuk memvalidasi input
const validateInput = (data, isCreate) => {
  if (isCreate) {
    if (!data.id_user || !data.id_hewan) {
      throw new Error("ID pemilik dan ID hewan tidak ditemukan");
    }
  }
  if (
    !data.id_rekam_medis ||
    !data.id_dokter ||
    !data.id_appointment ||
    !data.id_obat ||
    !data.id_resep
  ) {
    throw new Error("Missing required fields");
  }
  if (
    typeof data.jumlah_pembayaran !== "number" ||
    data.jumlah_pembayaran <= 0
  ) {
    throw new Error("Jumlah pembayaran harus lebih besar dari nol.");
  }
};

const pembayaranController = {
  // Admin: CRUD semua tabel
  adminCRUDPembayaran: async (req, res) => {
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
          try {
            validateInput(data, true); // Validasi untuk create
            result = await prisma.pembayaran.create({
              data: connectData(data),
            });
            return res.status(201).json({ success: true, data: result });
          } catch (error) {
            console.error("Error creating pembayaran:", error);
            return res
              .status(400)
              .json({ success: false, message: error.message });
          }

        case "read":
          try {
            result = await prisma.pembayaran.findMany({
              orderBy: { id_pembayaran: "asc" },
              select: {
                id_pembayaran: true,
                id_rekam_medis: true,
                rekam_medis: { select: { keluhan: true } },
                id_user: true,
                user: { select: { username: true } },
                id_hewan: true,
                hewan: { select: { nama_hewan: true } },
                id_dokter: true,
                dokter: { select: { nama_dokter: true } },
                id_appointment: true,
                appointment: { select: { catatan: true } },
                id_obat: true,
                obat: { select: { nama_obat: true } },
                id_resep: true,
                resep: { select: { jumlah_obat: true } },
                tgl_pembayaran: true,
                jumlah_pembayaran: true,
              },
            });

            const formattedResult = result.map((pembayaran) => ({
              ...pembayaran,
              tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
              jumlah_pembayaran: pembayaran.jumlah_pembayaran.toString(),
            }));

            return res.json({ success: true, data: formattedResult });
          } catch (error) {
            console.error("Error fetching data pembayaran:", error);
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }

        case "update":
          try {
            if (!data.id_pembayaran) {
              return res
                .status(400)
                .json({ success: false, message: "Missing ID Pembayaran" });
            }
            // Cek apakah ID Resep yang diberikan ada dalam database
            const resepExists = await prisma.resep.findUnique({
              where: { id_resep: data.id_resep },
            });

            if (!resepExists) {
              return res
                .status(400)
                .json({ success: false, message: "ID Resep tidak ditemukan." });
            }

            validateInput(data, false); // Validasi untuk update
            result = await prisma.pembayaran.update({
              where: { id_pembayaran: data.id_pembayaran },
              data: connectData(data),
            });
            return res.json({ success: true, data: result });
          } catch (error) {
            console.error("Error updating pembayaran:", error);
            return res
              .status(400)
              .json({ success: false, message: error.message });
          }

        case "delete":
          try {
            if (!data || !data.id_pembayaran) {
              // Pastikan data tidak undefined
              return res
                .status(400)
                .json({ success: false, message: "Missing ID Pembayaran" });
            }

            // Cek apakah ID Pembayaran yang diberikan ada dalam database
            const pembayaranExists = await prisma.pembayaran.findUnique({
              where: { id_pembayaran: data.id_pembayaran },
            });

            if (!pembayaranExists) {
              return res.status(404).json({
                success: false,
                message: "Pembayaran tidak ditemukan.",
              });
            }

            result = await prisma.pembayaran.delete({
              where: { id: data.id_pembayaran },
            });
            return res.json({
              success: true,
              message: "Pembayaran deleted successfully",
            });
          } catch (error) {
            console.error("Error deleting pembayaran:", error);
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
      console.error("Unexpected error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDPembayaran: async (req, res) => {
    try {
      // Pastikan user memiliki peran pegawai
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
            validateInput(data, true); // Validasi untuk create
            result = await prisma.pembayaran.create({
              data: connectData(data),
            });
            return res.status(201).json({ success: true, data: result });
          } catch (error) {
            console.error("Error creating pembayaran:", error);
            return res
              .status(400)
              .json({ success: false, message: error.message });
          }
        case "read":
          try {
            result = await prisma.pembayaran.findMany({
              orderBy: { id_pembayaran: "asc" },
              select: {
                id_pembayaran: true,
                id_rekam_medis: true,
                rekam_medis: { select: { keluhan: true } },
                id_user: true,
                user: { select: { username: true } },
                id_hewan: true,
                hewan: { select: { nama_hewan: true } },
                id_dokter: true,
                dokter: { select: { nama_dokter: true } },
                id_appointment: true,
                appointment: { select: { catatan: true } },
                id_obat: true,
                obat: { select: { nama_obat: true } },
                id_resep: true,
                resep: { select: { jumlah_obat: true } },
                tgl_pembayaran: true,
                jumlah_pembayaran: true,
              },
            });

            const formattedResult = result.map((pembayaran) => ({
              ...pembayaran,
              tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
              jumlah_pembayaran: pembayaran.jumlah_pembayaran.toString(),
            }));

            return res.json({ success: true, data: formattedResult });
          } catch (error) {
            console.error("Error fetching data pembayaran:", error);
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }

        case "update":
          try {
            if (!data.id_pembayaran) {
              return res
                .status(400)
                .json({ success: false, message: "Missing ID Pembayaran" });
            }
            // Cek apakah ID Resep yang diberikan ada dalam database
            const resepExists = await prisma.resep.findUnique({
              where: { id_resep: data.id_resep },
            });

            if (!resepExists) {
              return res
                .status(400)
                .json({ success: false, message: "ID Resep tidak ditemukan." });
            }

            validateInput(data, false); // Validasi untuk update
            result = await prisma.pembayaran.update({
              where: { id_pembayaran: data.id_pembayaran },
              data: connectData(data),
            });
            return res.json({ success: true, data: result });
          } catch (error) {
            console.error("Error updating pembayaran:", error);
            return res
              .status(400)
              .json({ success: false, message: error.message });
          }

        case "delete":
          try {
            if (!data.id_pembayaran) {
              return res
                .status(400)
                .json({ success: false, message: "Missing ID Pembayaran" });
            }
            result = await prisma.pembayaran.delete({
              where: { id_pembayaran: data.id_pembayaran },
            });
            return res.json({
              success: true,
              message: "Pembayaran deleted successfully",
            });
          } catch (error) {
            console.error("Error deleting pembayaran:", error);
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
      console.error("Unexpected error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikReadPembayaran: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
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
          try {
            result = await prisma.pembayaran.findMany({
              orderBy: { id_pembayaran: "asc" },
              select: {
                id_pembayaran: true,
                id_rekam_medis: true,
                rekam_medis: { select: { keluhan: true } },
                id_user: true,
                user: { select: { username: true } },
                id_hewan: true,
                hewan: { select: { nama_hewan: true } },
                id_dokter: true,
                dokter: { select: { nama_dokter: true } },
                id_appointment: true,
                appointment: { select: { catatan: true } },
                id_obat: true,
                obat: { select: { nama_obat: true } },
                id_resep: true,
                resep: { select: { jumlah_obat: true } },
                tgl_pembayaran: true,
                jumlah_pembayaran: true,
              },
            });

            const formattedResult = result.map((pembayaran) => ({
              ...pembayaran,
              tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
              jumlah_pembayaran: pembayaran.jumlah_pembayaran.toString(),
            }));

            return res.json({ success: true, data: formattedResult });
          } catch (error) {
            console.error("Error fetching data pembayaran:", error);
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }

        case "update":
          try {
            if (!data.id_pembayaran) {
              return res
                .status(400)
                .json({ success: false, message: "Missing ID Pembayaran" });
            }
            // Cek apakah ID Resep yang diberikan ada dalam database
            const resepExists = await prisma.resep.findUnique({
              where: { id_resep: data.id_resep },
            });

            if (!resepExists) {
              return res
                .status(400)
                .json({ success: false, message: "ID Resep tidak ditemukan." });
            }

            validateInput(data, false); // Validasi untuk update
            result = await prisma.pembayaran.update({
              where: { id_pembayaran: data.id_pembayaran },
              data: connectData(data),
            });
            return res.json({ success: true, data: result });
          } catch (error) {
            console.error("Error updating pembayaran:", error);
            return res
              .status(400)
              .json({ success: false, message: error.message });
          }

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

export default pembayaranController;
