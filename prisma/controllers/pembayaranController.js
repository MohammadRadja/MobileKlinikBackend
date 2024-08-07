import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const parseDate = (dateStr) => {
  // Jika sudah dalam format ISO-8601, langsung kembalikan
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Format tanggal tidak valid: ${dateStr}`);
    }
    return date.toISOString();
  }

  // Jika dalam format DD-MM-YYYY, lakukan konversi
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

const pembayaranController = {
  /**
   * Fungsi untuk mengelola CRUD Appointment oleh Admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  adminCRUDPembayaran: async (req, res) => {
    try {
      const { user } = req;

      // Memeriksa apakah pengguna adalah admin
      if (user.jabatan !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak diizinkan" });
      }

      const { action, data } = req.body;
      console.log("Action diterima:", action); // Log action yang diterima
      console.log("Data diterima:", data); // Log data yang diterima

      let result;

      switch (action) {
        case "create":
          // Validasi input untuk aksi create
          if (
            !data.id_rekam_medis ||
            !data.id_user ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.id_appointment ||
            !data.id_obat ||
            !data.id_resep ||
            !data.tgl_pembayaran ||
            !data.jumlah_pembayaran
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }
          result = await prisma.pembayaran.create({
            data: {
              id_rekam_medis: data.id_rekam_medis,
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              id_appointment: data.id_appointment,
              id_obat: data.id_obat,
              id_resep: data.id_resep,
              tgl_pembayaran: parseDate(data.tgl_pembayaran),
              jumlah_pembayaran: data.jumlah_pembayaran,
            },
          });
          console.log("Pembayaran berhasil dibuat:", result);
          break;

        case "read":
          // Membaca data appointment
          result = await prisma.pembayaran.findMany({
            orderBy: {
              id_pembayaran: "asc",
            },
            select: {
              id_pembayaran: true,
              id_rekam_medis: true,
              rekam_medis: {
                select: {
                  keluhan: true,
                },
              },
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_dokter: true,
              dokter: {
                select: {
                  nama_dokter: true,
                },
              },
              id_appointment: true,
              appointment: {
                select: {
                  catatan: true,
                },
              },
              id_obat: true,
              obat: {
                select: {
                  nama_obat: true,
                },
              },
              id_resep: true,
              resep: {
                select: {
                  jumlah_obat: true,
                },
              },
              tgl_pembayaran: true,
              jumlah_pembayaran: true,
            },
          });
          result = result.map((pembayaran) => ({
            ...pembayaran,
            tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
          }));
          console.log("Data Pembayaran:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "ID Pembayaran hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const pembayaranToUpdate = await prisma.pembayaran.findUnique({
            where: { id_pembayaran: data.id_pembayaran },
          });

          if (!pembayaranToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Pembayaran tidak ditemukan" });
          }

          // Memeriksa apakah id_resep valid
          const resepToCheck = await prisma.resep.findUnique({
            where: { id_resep: data.id_resep },
          });

          if (!resepToCheck) {
            return res
              .status(400)
              .json({ success: false, message: "ID Resep tidak valid" });
          }

          // Validasi tanggal pembayaran
          const tglPembayaran = new Date(data.tgl_pembayaran);
          if (isNaN(tglPembayaran.getTime())) {
            return res.status(400).json({
              success: false,
              message: "Tanggal pembayaran tidak valid",
            });
          }

          // Perbarui data pembayaran
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran }, // Gunakan string langsung
            data: {
              id_rekam_medis: data.id_rekam_medis,
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              id_appointment: data.id_appointment,
              id_obat: data.id_obat,
              id_resep: data.id_resep,
              tgl_pembayaran: tglPembayaran.toISOString(), // Gunakan format ISO-8601
              jumlah_pembayaran: data.jumlah_pembayaran,
            },
          });

          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Periksa ID pembayaran yang diterima
          if (!data.id_pembayaran) {
            return res.status(400).json({
              success: false,
              message: "ID Pembayaran tidak valid",
            });
          }

          // Cari pembayaran untuk memastikan catatan ada
          const pembayaran = await prisma.pembayaran.findUnique({
            where: { id_pembayaran: data.id_pembayaran },
          });

          if (!pembayaran) {
            return res.status(404).json({
              success: false,
              message: "Data Pembayaran tidak ditemukan",
            });
          }

          // Menghapus data pembayaran
          result = await prisma.pembayaran.delete({
            where: { id_pembayaran: data.id_pembayaran },
          });
          console.log("Delete Data Pembayaran berhasil dibuat:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di adminCRUDPembayaran:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDPembayaran: async (req, res) => {
    try {
      const { user } = req;

      // Verifikasi peran pengguna
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak sah" });
      }

      const { action, data } = req.body;
      console.log("Action diterima:", action); // Log action yang diterima
      console.log("Data diterima:", data); // Log data yang diterima

      let result;

      switch (action) {
        case "create":
          // Validasi input untuk aksi create
          if (
            !data.id_rekam_medis ||
            !data.id_user ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.id_appointment ||
            !data.id_obat ||
            !data.id_resep ||
            !data.tgl_pembayaran ||
            !data.jumlah_pembayaran
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }
          try {
            result = await prisma.pembayaran.create({
              data: {
                id_rekam_medis: data.id_rekam_medis,
                id_user: data.id_user,
                id_hewan: data.id_hewan,
                id_dokter: data.id_dokter,
                id_appointment: data.id_appointment,
                id_obat: data.id_obat,
                id_resep: data.id_resep,
                tgl_pembayaran: parseDate(data.tgl_pembayaran),
                jumlah_pembayaran: data.jumlah_pembayaran,
              },
            });
            console.log("Pembayaran berhasil dibuat:", result);
            return res.status(200).json({
              success: true,
              message: "Pembayaran berhasil dibuat",
              data: result,
            });
          } catch (error) {
            console.error("Error saat membuat pembayaran:", error);
            return res.status(500).json({
              success: false,
              message: "Terjadi kesalahan saat membuat pembayaran",
              error: error.message,
            });
          }
          break;

        case "read":
          // Membaca data appointment
          result = await prisma.pembayaran.findMany({
            orderBy: {
              id_pembayaran: "asc",
            },
            select: {
              id_pembayaran: true,
              id_rekam_medis: true,
              rekam_medis: {
                select: {
                  keluhan: true,
                },
              },
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_dokter: true,
              dokter: {
                select: {
                  nama_dokter: true,
                },
              },
              id_appointment: true,
              appointment: {
                select: {
                  catatan: true,
                },
              },
              id_obat: true,
              obat: {
                select: {
                  nama_obat: true,
                },
              },
              id_resep: true,
              resep: {
                select: {
                  jumlah_obat: true,
                },
              },
              tgl_pembayaran: true,
              jumlah_pembayaran: true,
            },
          });
          result = result.map((pembayaran) => ({
            ...pembayaran,
            tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
          }));
          console.log("Data Pembayaran:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "ID Pembayaran hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const pembayaranToUpdate = await prisma.pembayaran.findUnique({
            where: { id_pembayaran: data.id_pembayaran },
          });
          console.log(
            "Pembayaran yang akan diperbarui ditemukan:",
            pembayaranToUpdate
          );

          // Perbarui data pembayaran
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran }, // Gunakan string langsung
            data: {
              id_rekam_medis: data.id_rekam_medis,
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              id_appointment: data.id_appointment,
              id_obat: data.id_obat,
              id_resep: data.id_resep,
              tgl_pembayaran: parseDate(data.tgl_pembayaran), // Pastikan parseDate mengembalikan format yang benar
              jumlah_pembayaran: data.jumlah_pembayaran,
            },
          });

          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Menghapus data pembayaran
          result = await prisma.pembayaran.delete({
            where: { id_pembayaran: data.id_pembayaran }, // Gunakan string langsung
          });
          console.log("Delete Data Pembayaran berhasil dibuat:", result);
          return res.status(200).json({
            success: true,
            message: "Data Pembayaran berhasil dihapus",
            data: result,
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di pegawai:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikCRUDPembayaran: async (req, res) => {
    try {
      const { user } = req;

      // Verifikasi peran pengguna
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Akses tidak sah" });
      }

      const idPemilik = user.id_user || ""; // Ganti dengan logika yang sesuai jika diperlukan
      const { action, data } = req.body;
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "create":
          // Validasi input untuk aksi create
          if (
            !data.id_rekam_medis ||
            !data.id_user ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.id_appointment ||
            !data.id_obat ||
            !data.id_resep ||
            !data.tgl_pembayaran ||
            !data.jumlah_pembayaran
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }
          try {
            result = await prisma.pembayaran.create({
              data: {
                id_rekam_medis: data.id_rekam_medis,
                id_user: data.idPemilik,
                id_hewan: data.id_hewan,
                id_dokter: data.id_dokter,
                id_appointment: data.id_appointment,
                id_obat: data.id_obat,
                id_resep: data.id_resep,
                tgl_pembayaran: parseDate(data.tgl_pembayaran),
                jumlah_pembayaran: data.jumlah_pembayaran,
              },
            });
            console.log("Pembayaran berhasil dibuat:", result);
            return res.status(200).json({
              success: true,
              message: "Pembayaran berhasil dibuat",
              data: result,
            });
          } catch (error) {
            console.error("Error saat membuat pembayaran:", error);
            return res.status(500).json({
              success: false,
              message: "Terjadi kesalahan saat membuat pembayaran",
              error: error.message,
            });
          }
          break;

        case "read":
          // Membaca data appointment
          result = await prisma.pembayaran.findMany({
            orderBy: {
              id_pembayaran: "asc",
            },
            select: {
              id_pembayaran: true,
              id_rekam_medis: true,
              rekam_medis: {
                select: {
                  keluhan: true,
                },
              },
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_dokter: true,
              dokter: {
                select: {
                  nama_dokter: true,
                },
              },
              id_appointment: true,
              appointment: {
                select: {
                  catatan: true,
                },
              },
              id_obat: true,
              obat: {
                select: {
                  nama_obat: true,
                },
              },
              id_resep: true,
              resep: {
                select: {
                  jumlah_obat: true,
                },
              },
              tgl_pembayaran: true,
              jumlah_pembayaran: true,
            },
          });
          result = result.map((pembayaran) => ({
            ...pembayaran,
            tgl_pembayaran: formatDate(new Date(pembayaran.tgl_pembayaran)),
          }));
          console.log("Data Pembayaran:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.id_pembayaran) {
            return res
              .status(400)
              .json({ success: false, message: "ID Pembayaran hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const pembayaranToUpdate = await prisma.pembayaran.findUnique({
            where: { id_pembayaran: data.id_pembayaran },
          });

          if (!pembayaranToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Pembayaran tidak ditemukan" });
          }

          // Memeriksa apakah id_resep valid
          const resepToCheck = await prisma.resep.findUnique({
            where: { id_resep: data.id_resep },
          });

          if (!resepToCheck) {
            return res
              .status(400)
              .json({ success: false, message: "ID Resep tidak valid" });
          }

          // Validasi tanggal pembayaran
          const tglPembayaran = new Date(data.tgl_pembayaran);
          if (isNaN(tglPembayaran.getTime())) {
            return res.status(400).json({
              success: false,
              message: "Tanggal pembayaran tidak valid",
            });
          }

          // Perbarui data pembayaran
          result = await prisma.pembayaran.update({
            where: { id_pembayaran: data.id_pembayaran }, // Gunakan string langsung
            data: {
              id_rekam_medis: data.id_rekam_medis,
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              id_appointment: data.id_appointment,
              id_obat: data.id_obat,
              id_resep: data.id_resep,
              tgl_pembayaran: tglPembayaran.toISOString(), // Gunakan format ISO-8601
              jumlah_pembayaran: data.jumlah_pembayaran,
            },
          });

          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Menghapus data pembayaran
          result = await prisma.pembayaran.delete({
            where: { id_pembayaran: data.id_pembayaran }, // Gunakan string langsung
          });
          console.log("Delete Data Pembayaran berhasil dibuat:", result);
          return res.status(200).json({
            success: true,
            message: "Data Pembayaran berhasil dihapus",
            data: result,
          });

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di pegawai:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default pembayaranController;
