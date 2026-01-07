-- DropForeignKey
ALTER TABLE "BoardCollaborator" DROP CONSTRAINT "BoardCollaborator_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardElement" DROP CONSTRAINT "BoardElement_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardVersion" DROP CONSTRAINT "BoardVersion_boardId_fkey";

-- AddForeignKey
ALTER TABLE "BoardElement" ADD CONSTRAINT "BoardElement_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardCollaborator" ADD CONSTRAINT "BoardCollaborator_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardVersion" ADD CONSTRAINT "BoardVersion_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
