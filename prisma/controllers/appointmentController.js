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

const appointmentController = {
  /**
   * Fungsi untuk mengelola CRUD Appointment oleh Admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  adminCRUDAppointment: async (req, res) => {
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
            !data.id_user ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.tgl_appointment
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }
          result = await prisma.appointment.create({
            data: {
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              tgl_appointment: parseDate(data.tgl_appointment),
              catatan: data.catatan,
            },
          });
          console.log("Appointment berhasil dibuat:", result);
          break;

        case "read":
          // Membaca data appointment
          result = await prisma.appointment.findMany({
            orderBy: {
              id_appointment: "asc",
            },
            select: {
              id_appointment: true,
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
              tgl_appointment: true,
              catatan: true,
            },
          });
          result = result.map((appointment) => ({
            ...appointment,
            tgl_appointment: formatDate(new Date(appointment.tgl_appointment)),
          }));
          console.log("Data Appointment:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "ID Appointment hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const appointmentToUpdate = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (!appointmentToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment tidak ditemukan" });
          }
          console.log(
            "Appointment yang akan diperbarui ditemukan:",
            appointmentToUpdate,
          );

          // Perbarui data appointment
          result = await prisma.appointment.update({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
            data: {
              id_user: data.id_user, // Tidak perlu parse ke integer jika id_user adalah string
              id_hewan: data.id_hewan, // Tidak perlu parse ke integer jika id_hewan adalah string
              id_dokter: data.id_dokter, // Tidak perlu parse ke integer jika id_dokter adalah string
              tgl_appointment: parseDate(data.tgl_appointment), // Pastikan parseDate mengembalikan format yang benar
              catatan: data.catatan,
            },
          });

          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Validasi input untuk aksi delete
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "ID Appointment hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum dihapus
          const appointmentToDelete = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (!appointmentToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment tidak ditemukan" });
          }
          console.log(
            "Appointment yang akan dihapus ditemukan:",
            appointmentToDelete,
          );

          // Memeriksa apakah ada rekaman terkait
          const relatedRecords = await prisma.pembayaran.findMany({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (relatedRecords.length > 0) {
            return res.status(400).json({
              success: false,
              message:
                "Tidak dapat menghapus appointment dengan rekaman terkait",
            });
          }

          // Menghapus appointment
          result = await prisma.appointment.delete({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });
          console.log("Delete berhasil:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error di adminCRUDAppointment:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pegawai: CRUD semua tabel kecuali admin
  pegawaiCRUDAppointment: async (req, res) => {
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
            !data.id_user ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.tgl_appointment
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }
          result = await prisma.appointment.create({
            data: {
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              tgl_appointment: parseDate(data.tgl_appointment),
              catatan: data.catatan,
            },
          });
          console.log("Appointment berhasil dibuat:", result);
          break;

        case "read":
          // Membaca data appointment
          result = await prisma.appointment.findMany({
            orderBy: {
              id_appointment: "asc",
            },
            select: {
              id_appointment: true,
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
              tgl_appointment: true,
              catatan: true,
            },
          });
          result = result.map((appointment) => ({
            ...appointment,
            tgl_appointment: formatDate(new Date(appointment.tgl_appointment)),
          }));
          console.log("Data Appointment:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "ID Appointment hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const appointmentToUpdate = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (!appointmentToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment tidak ditemukan" });
          }
          console.log(
            "Appointment yang akan diperbarui ditemukan:",
            appointmentToUpdate,
          );

          // Perbarui data appointment
          result = await prisma.appointment.update({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
            data: {
              id_user: data.id_user, // Tidak perlu parse ke integer jika id_user adalah string
              id_hewan: data.id_hewan, // Tidak perlu parse ke integer jika id_hewan adalah string
              id_dokter: data.id_dokter, // Tidak perlu parse ke integer jika id_dokter adalah string
              tgl_appointment: parseDate(data.tgl_appointment), // Pastikan parseDate mengembalikan format yang benar
              catatan: data.catatan,
            },
          });

          console.log("Update berhasil:", result);
          break;

        case "delete":
          // Validasi input untuk aksi delete
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "ID Appointment hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum dihapus
          const appointmentToDelete = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (!appointmentToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment tidak ditemukan" });
          }
          console.log(
            "Appointment yang akan dihapus ditemukan:",
            appointmentToDelete,
          );

          // Memeriksa apakah ada rekaman terkait
          const relatedRecords = await prisma.pembayaran.findMany({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (relatedRecords.length > 0) {
            return res.status(400).json({
              success: false,
              message:
                "Tidak dapat menghapus appointment dengan rekaman terkait",
            });
          }

          // Menghapus appointment
          result = await prisma.appointment.delete({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });
          console.log("Delete berhasil:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error dalam pegawaiCRUDAppointment:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Pemilik: Hanya dapat melihat data
  pemilikCRUDAppointment: async (req, res) => {
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
            !data.id_user ||
            !data.id_hewan ||
            !data.id_dokter ||
            !data.tgl_appointment
          ) {
            return res.status(400).json({
              success: false,
              message: "Field yang diperlukan hilang",
            });
          }
          result = await prisma.appointment.create({
            data: {
              id_user: data.id_user,
              id_hewan: data.id_hewan,
              id_dokter: data.id_dokter,
              tgl_appointment: parseDate(data.tgl_appointment),
              catatan: data.catatan,
            },
          });
          console.log("Appointment berhasil dibuat:", result);
          break;

        case "read":
          // Baca semua janji untuk pemilik tertentu
          result = await prisma.appointment.findMany({
            where: { id_user: idPemilik },
            orderBy: {
              id_appointment: "asc",
            },
            select: {
              id_appointment: true,
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
              tgl_appointment: true,
              catatan: true,
            },
          });

          // Format tanggal
          result = result.map((appointment) => ({
            ...appointment,
            tgl_appointment: formatDate(new Date(appointment.tgl_appointment)),
          }));
          console.log("Data Janji untuk pemilik:", result);
          break;

        case "update":
          // Validasi input untuk aksi update
          if (!data.id_appointment) {
            return res
              .status(400)
              .json({ success: false, message: "ID Appointment hilang" });
          }

          // Memeriksa apakah rekaman ada sebelum diperbarui
          const appointmentToUpdate = await prisma.appointment.findUnique({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
          });

          if (!appointmentToUpdate) {
            return res
              .status(404)
              .json({ success: false, message: "Appointment tidak ditemukan" });
          }
          console.log(
            "Appointment yang akan diperbarui ditemukan:",
            appointmentToUpdate,
          );

          // Perbarui data appointment
          result = await prisma.appointment.update({
            where: { id_appointment: data.id_appointment }, // Gunakan string langsung
            data: {
              id_user: data.id_user, // Tidak perlu parse ke integer jika id_user adalah string
              id_hewan: data.id_hewan, // Tidak perlu parse ke integer jika id_hewan adalah string
              id_dokter: data.id_dokter, // Tidak perlu parse ke integer jika id_dokter adalah string
              tgl_appointment: parseDate(data.tgl_appointment), // Pastikan parseDate mengembalikan format yang benar
              catatan: data.catatan,
            },
          });

          console.log("Update berhasil:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Aksi tidak valid" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error dalam pemilikCRUDAppointment:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default appointmentController;
