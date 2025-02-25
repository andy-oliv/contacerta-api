-- AlterTable
ALTER TABLE `account` MODIFY `balance` DECIMAL(10, 2) NOT NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('INCOME', 'EXPENSE', 'TRANSFER') NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `repeat` BOOLEAN NOT NULL DEFAULT false,
    `repetitionNumber` INTEGER NULL,
    `repeatInterval` ENUM('DAILY', 'WEEKLY', 'MONTHLY') NULL,
    `date` DATE NOT NULL,
    `observations` TEXT NULL,
    `attachmentUrl` VARCHAR(250) NULL,
    `categoryId` INTEGER NULL,
    `creditCardId` INTEGER NULL,
    `accountId` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creditcard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(100) NOT NULL,
    `iconUrl` VARCHAR(250) NOT NULL,
    `color` VARCHAR(20) NOT NULL,
    `totalLimit` DECIMAL(10, 2) NOT NULL,
    `currentLimit` DECIMAL(10, 2) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(50) NOT NULL,
    `iconUrl` VARCHAR(250) NOT NULL,
    `color` VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `Creditcard`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
