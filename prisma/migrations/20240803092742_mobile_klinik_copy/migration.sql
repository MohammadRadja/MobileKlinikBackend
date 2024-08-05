/*
  Warnings:

  - The primary key for the `appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dokter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `hewan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `obat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pembayaran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rekammedis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `resep` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_id_dokter_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_id_hewan_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_id_appointment_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_id_dokter_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_id_hewan_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_id_obat_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_id_rekam_medis_fkey`;

-- DropForeignKey
ALTER TABLE `pembayaran` DROP FOREIGN KEY `Pembayaran_id_resep_fkey`;

-- DropForeignKey
ALTER TABLE `rekammedis` DROP FOREIGN KEY `RekamMedis_id_hewan_fkey`;

-- DropForeignKey
ALTER TABLE `rekammedis` DROP FOREIGN KEY `RekamMedis_id_obat_fkey`;

-- DropForeignKey
ALTER TABLE `resep` DROP FOREIGN KEY `Resep_id_obat_fkey`;

-- DropForeignKey
ALTER TABLE `resep` DROP FOREIGN KEY `Resep_id_rekam_medis_fkey`;

-- AlterTable
ALTER TABLE `appointment` DROP PRIMARY KEY,
    MODIFY `id_appointment` CHAR(36) NOT NULL,
    MODIFY `id_hewan` VARCHAR(191) NOT NULL,
    MODIFY `id_dokter` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_appointment`);

-- AlterTable
ALTER TABLE `dokter` DROP PRIMARY KEY,
    MODIFY `id_dokter` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id_dokter`);

-- AlterTable
ALTER TABLE `hewan` DROP PRIMARY KEY,
    MODIFY `id_hewan` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id_hewan`);

-- AlterTable
ALTER TABLE `obat` DROP PRIMARY KEY,
    MODIFY `id_obat` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id_obat`);

-- AlterTable
ALTER TABLE `pembayaran` DROP PRIMARY KEY,
    MODIFY `id_pembayaran` CHAR(36) NOT NULL,
    MODIFY `id_rekam_medis` VARCHAR(191) NOT NULL,
    MODIFY `id_hewan` VARCHAR(191) NOT NULL,
    MODIFY `id_dokter` VARCHAR(191) NOT NULL,
    MODIFY `id_appointment` VARCHAR(191) NOT NULL,
    MODIFY `id_obat` VARCHAR(191) NOT NULL,
    MODIFY `id_resep` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_pembayaran`);

-- AlterTable
ALTER TABLE `rekammedis` DROP PRIMARY KEY,
    MODIFY `id_rekam_medis` CHAR(36) NOT NULL,
    MODIFY `id_hewan` VARCHAR(191) NOT NULL,
    MODIFY `id_obat` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_rekam_medis`);

-- AlterTable
ALTER TABLE `resep` DROP PRIMARY KEY,
    MODIFY `id_resep` CHAR(36) NOT NULL,
    MODIFY `id_rekam_medis` VARCHAR(191) NOT NULL,
    MODIFY `id_obat` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_resep`);

-- AddForeignKey
ALTER TABLE `RekamMedis` ADD CONSTRAINT `RekamMedis_id_hewan_fkey` FOREIGN KEY (`id_hewan`) REFERENCES `Hewan`(`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekamMedis` ADD CONSTRAINT `RekamMedis_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `Obat`(`id_obat`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_rekam_medis_fkey` FOREIGN KEY (`id_rekam_medis`) REFERENCES `RekamMedis`(`id_rekam_medis`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_rekam_medis_fkey` FOREIGN KEY (`id_rekam_medis`) REFERENCES `RekamMedis`(`id_rekam_medis`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `Obat`(`id_obat`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_hewan_fkey` FOREIGN KEY (`id_hewan`) REFERENCES `Hewan`(`id_hewan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_dokter_fkey` FOREIGN KEY (`id_dokter`) REFERENCES `Dokter`(`id_dokter`) ON DELETE CASCADE ON UPDATE CASCADE;
