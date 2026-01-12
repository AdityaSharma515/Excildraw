import { prismaClient } from "@repo/db/client";

export async function canJoinRoom(
  userId: string,
  roomId: string
): Promise<boolean> {
  const board = await prismaClient.board.findFirst({
    where: {
      id: roomId,
      OR: [
        { ownerId: userId },
        {
          collaborators: {
            some: { userid:userId }
          }
        }
      ]
    },
    select: { id: true }
  });

  return Boolean(board);
}
