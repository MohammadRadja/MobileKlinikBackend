-- CreateTable
CREATE TABLE `User` (
    `id_user` CHAR(36) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(15) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hewan` (
    `id_hewan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(191) NOT NULL,
    `nama_hewan` VARCHAR(191) NOT NULL,
    `jenis_hewan` VARCHAR(191) NOT NULL,
    `umur` INTEGER NOT NULL,
    `berat` DOUBLE NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_hewan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Obat` (
    `id_obat` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_obat` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_obat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RekamMedis` (
    `id_rekam_medis` INTEGER NOT NULL AUTO_INCREMENT,
    `id_hewan` INTEGER NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `id_obat` INTEGER NOT NULL,
    `keluhan` VARCHAR(191) NOT NULL,
    `diagnosa` VARCHAR(191) NOT NULL,
    `tgl_periksa` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_rekam_medis`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembayaran` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rekam_medis` INTEGER NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `id_hewan` INTEGER NOT NULL,
    `id_dokter` INTEGER NOT NULL,
    `id_appointment` INTEGER NOT NULL,
    `id_obat` INTEGER NOT NULL,
    `id_resep` INTEGER NOT NULL,
    `tgl_pembayaran` DATETIME(3) NOT NULL,
    `jumlah_pembayaran` DOUBLE NOT NULL,
    `bukti_pembayaran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resep` (
    `id_resep` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(191) NOT NULL,
    `id_rekam_medis` INTEGER NOT NULL,
    `id_obat` INTEGER NOT NULL,
    `jumlah_obat` INTEGER NOT NULL,

    PRIMARY KEY (`id_resep`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id_appointment` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(191) NOT NULL,
    `id_hewan` INTEGER NOT NULL,
    `id_dokter` INTEGER NOT NULL,
    `tgl_appointment` DATETIME(3) NOT NULL,
    `catatan` VARCHAR(191) NULL,

    PRIMARY KEY (`id_appointment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokter` (
    `id_dokter` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_dokter` VARCHAR(191) NOT NULL,
    `spesialisasi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_dokter`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hewan` ADD CONSTRAINT `Hewan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekamMedis` ADD CONSTRAINT `RekamMedis_id_hewan_fkey` FOREIGN KEY (`id_hewan`) REFERENCES `Hewan`(`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekamMedis` ADD CONSTRAINT `RekamMedis_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekamMedis` ADD CONSTRAINT `RekamMedis_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `Obat`(`id_obat`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_rekam_medis_fkey` FOREIGN KEY (`id_rekam_medis`) REFERENCES `RekamMedis`(`id_rekam_medis`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_hewan_fkey` FOREIGN KEY (`id_hewan`) REFERENCES `Hewan`(`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_dokter_fkey` FOREIGN KEY (`id_dokter`) REFERENCES `Dokter`(`id_dokter`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_appointment_fkey` FOREIGN KEY (`id_appointment`) REFERENCES `Appointment`(`id_appointment`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `Obat`(`id_obat`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_resep_fkey` FOREIGN KEY (`id_resep`) REFERENCES `Resep`(`id_resep`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_rekam_medis_fkey` FOREIGN KEY (`id_rekam_medis`) REFERENCES `RekamMedis`(`id_rekam_medis`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `Obat`(`id_obat`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_hewan_fkey` FOREIGN KEY (`id_hewan`) REFERENCES `Hewan`(`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_dokter_fkey` FOREIGN KEY (`id_dokter`) REFERENCES `Dokter`(`id_dokter`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
