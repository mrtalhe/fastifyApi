-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetToken" DROP NOT NULL,
ALTER COLUMN "resetExpire" DROP NOT NULL;
