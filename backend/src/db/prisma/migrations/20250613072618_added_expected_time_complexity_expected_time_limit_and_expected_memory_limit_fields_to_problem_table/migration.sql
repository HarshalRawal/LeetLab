/*
  Warnings:

  - Added the required column `expectedMemoryLimit` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedTimeComplexity` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedTimeLimit` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxInputSize` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "expectedMemoryLimit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expectedTimeComplexity" TEXT NOT NULL,
ADD COLUMN     "expectedTimeLimit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxInputSize" INTEGER NOT NULL;
