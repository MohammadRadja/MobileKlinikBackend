import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hewanController = {
  /**
   * Admin: CRUD operations for all tables
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  adminCRUDHewan: async (req, res) => {
    try {
      const { user } = req;
      // Ensure user has admin role
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
          // Validate input data
          if (
            !data.id_user ||
            !data.nama_hewan ||
            !data.jenis_hewan ||
            data.umur == null ||
            data.berat == null ||
            !data.jenis_kelamin
          ) {
            console.log("Missing or invalid required fields", data);
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }

          // Create new data
          result = await prisma.hewan.create({
            data: {
              id_user: data.id_user,
              nama_hewan: data.nama_hewan,
              jenis_hewan: data.jenis_hewan,
              umur: data.umur,
              berat: data.berat,
              jenis_kelamin: data.jenis_kelamin,
            },
          });
          break;

        case "read":
          result = await prisma.hewan.findMany({
            orderBy: {
              id_hewan: "asc",
            },
            include: {
              user: true,
            },
          });
          break;

        case "update":
          const { id_hewan, id_user, ...updateData } = data; // Ambil id_user dan data lainnya

          result = await prisma.hewan.update({
            where: { id_hewan },
            data: {
              ...updateData, // Sertakan semua data kecuali id_user
              // Hubungkan ke pengguna menggunakan id_user
              user: {
                connect: { id_user }, // Pastikan menggunakan id_user dari data
              },
            },
            include: {
              user: true,
            },
          });
          break;

        case "delete":
          result = await prisma.hewan.delete({
            where: { id_hewan: data.id_hewan },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("CRUD Hewan from Admin - Response status: 500");
      console.error("CRUD Hewan from Admin - Response body:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pegawai: CRUD operations except for admin table
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  pegawaiCRUDHewan: async (req, res) => {
    try {
      const { user } = req;

      // Ensure user has pegawai role
      if (user.jabatan !== "pegawai") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const { action, data } = req.body;
      let result;

      switch (action) {
        case "create":
          // Validate input data
          if (
            !data.id_user ||
            !data.nama_hewan ||
            !data.jenis_hewan ||
            data.umur == null ||
            data.berat == null ||
            !data.jenis_kelamin
          ) {
            return res
              .status(400)
              .json({ success: false, message: "Missing required fields" });
          }

          // Create new data
          result = await prisma.hewan.create({
            data: {
              id_user: data.id_user,
              nama_hewan: data.nama_hewan,
              jenis_hewan: data.jenis_hewan,
              umur: data.umur,
              berat: data.berat,
              jenis_kelamin: data.jenis_kelamin,
            },
            include: {
              user: true,
            },
          });
          break;

        case "read":
          result = await prisma.hewan.findMany({
            orderBy: {
              id_hewan: "asc",
            },
            include: {
              user: true,
            },
          });
          break;

        case "update":
          const {
            id_hewan: idHewanToUpdate,
            id_user: iduserToUpdate,
            ...updateDataPegawai
          } = data;

          result = await prisma.hewan.update({
            where: { id_hewan: idHewanToUpdate },
            data: {
              ...updateDataPegawai,
              user: {
                connect: { id_user: iduserToUpdate },
              },
            },
            include: {
              user: true,
            },
          });
          break;

        case "delete":
          result = await prisma.hewan.delete({
            where: { id_hewan: data.id_hewan },
          });
          break;

        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error in pegawaiCRUDHewan:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Pemilik: Only allowed to read data
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  pemilikCRUDHewan: async (req, res) => {
    try {
      const { user } = req;

      // Ensure user has pemilik role
      if (user.jabatan !== "pemilik") {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access" });
      }

      const idPemilik = user.id_user || ""; // Replace with appropriate logic if needed
      if (!idPemilik) {
        console.log("Missing idPemilik in user object.");
        return res
          .status(400)
          .json({ success: false, message: "ID pemilik tidak ditemukan." });
      }

      const { action, data } = req.body;

      // Ensure action is present
      if (!action) {
        console.log("Action is missing.");
        return res
          .status(400)
          .json({ success: false, message: "Action is required." });
      }

      switch (action) {
        case "read":
          // Find user
          const user = await prisma.user.findUnique({
            where: { id_user: idPemilik },
          });

          if (!user) {
            console.log("Pemilik not found for ID:", idPemilik);
            return res
              .status(404)
              .json({ success: false, message: "Pemilik not found." });
          }

          // Fetch hewan for the pemilik
          const hewanResult = await prisma.hewan.findMany({
            orderBy: {
              id_hewan: "asc",
            },
            where: { id_user: idPemilik },
            include: {
              user: true,
            },
          });

          if (hewanResult.length === 0) {
            return res.status(404).json({
              success: false,
              message: "No hewan found for this pemilik.",
            });
          }

          return res.status(200).json({ success: true, data: hewanResult });

        default:
          console.log("Invalid action:", action);
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
      }
    } catch (error) {
      console.error("Error in pemilikReadHewan:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};

export default hewanController;
