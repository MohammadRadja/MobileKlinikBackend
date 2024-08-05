import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk parse tanggal DD-MM-YYYY ke format ISO-8601
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  console.log(`Parsed date from "${dateStr}" to "${date.toISOString()}"`);
  return date.toISOString();
};

// Fungsi untuk format tanggal ke DD-MM-YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const rekammedisController = {
  adminCRUDRekamMedis: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action CRUD Rekam Medis:", action);
      console.log("Data diterima:", data);

      let result;
      switch (action) {
        case "create":
          if (!data.tgl_periksa || !data.keluhan || !data.diagnosa) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }
          try {
            result = await prisma.rekamMedis.create({
              data: {
                id_hewan: data.id_hewan.toString(),
                id_user: data.id_user.toString(),
                id_obat: data.id_obat.toString(),
                keluhan: data.keluhan,
                diagnosa: data.diagnosa,
                tgl_periksa: parseDate(data.tgl_periksa),
              },
            });
          } catch (error) {
            console.error("Error creating rekam medis:", error);
            throw error;
          }
          break;

        case "read":
          try {
            result = await prisma.rekamMedis.findMany({
              orderBy: {
                id_rekam_medis: "asc",
              },
              select: {
                id_rekam_medis: true,
                id_hewan: true,
                hewan: {
                  select: {
                    nama_hewan: true,
                  },
                },
                id_user: true,
                user: {
                  select: {
                    username: true,
                  },
                },
                id_obat: true,
                obat: {
                  select: {
                    nama_obat: true,
                  },
                },
                keluhan: true,
                diagnosa: true,
                tgl_periksa: true,
              },
            });

            result = result.map((rekamMedis) => ({
              ...rekamMedis,
              tgl_periksa: formatDate(new Date(rekamMedis.tgl_periksa)),
            }));
            console.log("Data Rekam Medis:", result);
          } catch (error) {
            console.error("Error reading rekam medis:", error);
            throw error;
          }
          break;

        case "update":
          if (!data.id_rekam_medis) {
            return res
              .status(400)
              .json({ success: false, message: "Missing id_rekam_medis" });
          }

          // Pengecekan apakah rekaman ada di database sebelum update
          const existingRecord = await prisma.rekamMedis.findUnique({
            where: { id_rekam_medis: data.id_rekam_medis.toString() },
          });

          if (!existingRecord) {
            return res
              .status(404)
              .json({ success: false, message: "Record to update not found" });
          }

          try {
            result = await prisma.rekamMedis.update({
              where: { id_rekam_medis: data.id_rekam_medis.toString() },
              data: {
                id_hewan: data.id_hewan.toString(),
                id_user: data.id_user.toString(),
                id_obat: data.id_obat.toString(),
                keluhan: data.keluhan,
                diagnosa: data.diagnosa,
                tgl_periksa: parseDate(data.tgl_periksa),
              },
            });
          } catch (error) {
            console.error("Error updating rekam medis:", error);
            throw error;
          }
          break;

        case "delete":
          if (!data.id_rekam_medis) {
            return res
              .status(400)
              .json({ success: false, message: "Missing id_rekam_medis" });
          }

          // Pengecekan apakah rekaman ada di database sebelum delete
          const recordToDelete = await prisma.rekamMedis.findUnique({
            where: { id_rekam_medis: data.id_rekam_medis.toString() },
          });

          if (!recordToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Record to delete not found" });
          }

          try {
            result = await prisma.rekamMedis.delete({
              where: { id_rekam_medis: data.id_rekam_medis.toString() },
            });
          } catch (error) {
            console.error("Error deleting rekam medis:", error);
            throw error;
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in adminCRUDRekamMedis:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  pegawaiCRUDRekamMedis: async (req, res) => {
    try {
      const { user } = req;
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      console.log("Action CRUD Rekam Medis:", action);
      console.log("Data diterima:", data);

      let result;
      switch (action) {
        case "create":
          if (!data.tgl_periksa || !data.keluhan || !data.diagnosa) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }
          try {
            result = await prisma.rekamMedis.create({
              data: {
                id_hewan: data.id_hewan.toString(),
                id_user: data.id_user.toString(),
                id_obat: data.id_obat.toString(),
                keluhan: data.keluhan,
                diagnosa: data.diagnosa,
                tgl_periksa: parseDate(data.tgl_periksa),
              },
            });
          } catch (error) {
            console.error("Error creating rekam medis:", error);
            throw error;
          }
          break;

        case "read":
          try {
            result = await prisma.rekamMedis.findMany({
              orderBy: {
                id_rekam_medis: "asc",
              },
              select: {
                id_rekam_medis: true,
                id_hewan: true,
                hewan: {
                  select: {
                    nama_hewan: true,
                  },
                },
                id_user: true,
                user: {
                  select: {
                    username: true,
                  },
                },
                id_obat: true,
                obat: {
                  select: {
                    nama_obat: true,
                  },
                },
                keluhan: true,
                diagnosa: true,
                tgl_periksa: true,
              },
            });

            result = result.map((rekamMedis) => ({
              ...rekamMedis,
              tgl_periksa: formatDate(new Date(rekamMedis.tgl_periksa)),
            }));
            console.log("Data Rekam Medis:", result);
          } catch (error) {
            console.error("Error reading rekam medis:", error);
            throw error;
          }
          break;

        case "update":
          if (!data.id_rekam_medis) {
            return res
              .status(400)
              .json({ success: false, message: "Missing id_rekam_medis" });
          }

          // Pengecekan apakah rekaman ada di database sebelum update
          const existingRecord = await prisma.rekamMedis.findUnique({
            where: { id_rekam_medis: data.id_rekam_medis.toString() },
          });

          if (!existingRecord) {
            return res
              .status(404)
              .json({ success: false, message: "Record to update not found" });
          }

          try {
            result = await prisma.rekamMedis.update({
              where: { id_rekam_medis: data.id_rekam_medis.toString() },
              data: {
                id_hewan: data.id_hewan.toString(),
                id_user: data.id_user.toString(),
                id_obat: data.id_obat.toString(),
                keluhan: data.keluhan,
                diagnosa: data.diagnosa,
                tgl_periksa: parseDate(data.tgl_periksa),
              },
            });
          } catch (error) {
            console.error("Error updating rekam medis:", error);
            throw error;
          }
          break;

        case "delete":
          if (!data.id_rekam_medis) {
            return res
              .status(400)
              .json({ success: false, message: "Missing id_rekam_medis" });
          }

          // Pengecekan apakah rekaman ada di database sebelum delete
          const recordToDelete = await prisma.rekamMedis.findUnique({
            where: { id_rekam_medis: data.id_rekam_medis.toString() },
          });

          if (!recordToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Record to delete not found" });
          }

          try {
            result = await prisma.rekamMedis.delete({
              where: { id_rekam_medis: data.id_rekam_medis.toString() },
            });
          } catch (error) {
            console.error("Error deleting rekam medis:", error);
            throw error;
          }
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error Pegawai in rekamMedisController:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  pemilikReadRekamMedis: async (req, res) => {
    try {
      // Pastikan user memiliki peran pemilik
      const { user } = req;
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPemilik = user.id_user || ""; // Ganti dengan logika yang sesuai jika diperlukan
      const { action, data } = req.body;
      console.log("Action:", action); // Log data yang diterima
      console.log("Data diterima:", data);
      let result;

      switch (action) {
        case "read":
          result = await prisma.rekamMedis.findMany({
            where: { id_user: idPemilik },
            orderBy: {
              id_rekam_medis: "asc",
            },
            select: {
              id_rekam_medis: true,
              id_hewan: true,
              hewan: {
                select: {
                  nama_hewan: true,
                },
              },
              id_user: true,
              user: {
                select: {
                  username: true,
                },
              },
              id_obat: true,
              obat: {
                select: {
                  nama_obat: true,
                },
              },
              keluhan: true,
              diagnosa: true,
              tgl_periksa: true,
            },
          });

          result = result.map((rekamMedis) => ({
            ...rekamMedis,
            tgl_periksa: formatDate(new Date(rekamMedis.tgl_periksa)),
          }));
          console.log("Data Rekam Medis:", result);
          break;

        case "update":
          // Update rekam medis
          const { id_rekam_medis, updateData } = data; // Pastikan data berisi id_rekam_medis dan updateData

          // Validasi input
          if (!id_rekam_medis || !updateData) {
            return res
              .status(400)
              .json({ success: false, message: "Incomplete data" });
          }

          // Perbarui rekam medis di database
          result = await prisma.rekamMedis.update({
            where: { id_rekam_medis: id_rekam_medis },
            data: updateData,
          });

          console.log("Rekam Medis diperbarui:", result);
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error dalam pemilikReadRekamMedis:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default rekammedisController;
