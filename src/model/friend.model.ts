export class FriendResponse {
  userId: number;
  friendId: number;
  status: string;
  createdAt: Date;
}

export class SendFriendRequest {
  userId: number;
  friendId: number;
}
