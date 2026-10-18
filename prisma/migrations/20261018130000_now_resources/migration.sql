-- AlterEnum
ALTER TYPE "NowCategory" ADD VALUE 'LISTENING';
ALTER TYPE "NowCategory" ADD VALUE 'WATCHING';

-- AlterTable
ALTER TABLE "NowItem" ADD COLUMN     "url" TEXT;
