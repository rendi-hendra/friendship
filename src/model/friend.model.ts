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

export class UpdateStatusRequest {
  userId: number;
  status: FriendshipStatus;
}

enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}
