/*
  Warnings:

  - Made the column `description` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AppointmentRequest" ADD COLUMN     "species" "Species"[];

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "description" SET NOT NULL;
