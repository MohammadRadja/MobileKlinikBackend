import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient(); //

async function seed() {
  const hashedAdmin = await bcrypt.hash("ARadja123", 10);
  const hashedAdmin2 = await bcrypt.hash("Maul123", 10);
  const hashedPegawai = await bcrypt.hash("Zidan123", 10);
  const hashedPegawai2 = await bcrypt.hash("Chiko123", 10);
  // Seed data untuk tabel User
  await prisma.user.createMany({
    data: [
      {
        id_user: uuidv4(),
        username: "Radja",
        password: hashedAdmin,
        jabatan: "admin",
        alamat: "Tangerang",
        no_telp: "081234567890",
        email: "radja@example.com",
      },
      {
        id_user: uuidv4(),
        username: "Maul",
        password: hashedAdmin2,
        jabatan: "admin",
        alamat: "Tangerang",
        no_telp: "081234567891",
        email: "maul@example.com",
      },
      {
        id_user: uuidv4(),
        username: "Zidan",
        password: hashedPegawai,
        jabatan: "pegawai",
        alamat: "Tangerang",
        no_telp: "081234567892",
        email: "zidan@example.com",
      },
      {
        id_user: uuidv4(),
        username: "Chiko",
        password: hashedPegawai2,
        jabatan: "pegawai",
        alamat: "Tangerang",
        no_telp: "081234567893",
        email: "chiko@example.com",
      },
    ],
  });

  // Seed data untuk tabel Dokter
  await prisma.dokter.createMany({
    data: [
      {
        id_dokter: uuidv4(),
        nama_dokter: "Dr. Asep Wijaya",
        spesialisasi: "Exotics",
      },
      {
        id_dokter: uuidv4(),
        nama_dokter: "Dr. Budi Santoso",
        spesialisasi: "Small Animals",
      },
      {
        id_dokter: uuidv4(),
        nama_dokter: "Dr. Chandra Dewi",
        spesialisasi: "Large Animals",
      },
      {
        id_dokter: uuidv4(),
        nama_dokter: "Dr. Dian Pratama",
        spesialisasi: "Surgery",
      },
      {
        id_dokter: uuidv4(),
        nama_dokter: "Dr. Eko Prabowo",
        spesialisasi: "Dermatology",
      },
    ],
  });

  // Seed data untuk tabel Obat
  await prisma.obat.createMany({
    data: [
      {
        id_obat: uuidv4(),
        nama_obat: "Antibiotik",
        keterangan: "Untuk mengobati infeksi bakteri",
      },
      {
        id_obat: uuidv4(),
        nama_obat: "Obat tetes mata",
        keterangan: "Untuk mengatasi iritasi mata",
      },
      {
        id_obat: uuidv4(),
        nama_obat: "Multivitamin",
        keterangan: "Untuk meningkatkan nafsu makan",
      },
      {
        id_obat: uuidv4(),
        nama_obat: "Painkiller",
        keterangan: "Untuk meredakan nyeri",
      },
      {
        id_obat: uuidv4(),
        nama_obat: "Shampoo anti-jerawat",
        keterangan: "Untuk mengobati dermatitis",
      },
    ],
  });

  console.log("Seeding Data Master Selesai");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
