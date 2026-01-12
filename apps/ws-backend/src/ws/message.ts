export type WSMessage =
  | { type: "JOIN_ROOM"; roomId: string }
  | { type: "LEAVE_ROOM"; roomId: string }
  | { type: "DRAW"; roomId: string; data: any };
