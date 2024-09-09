export class UserResponse {
  id: number;
  username: string;
  token?: string;
  createdAt?: Date;
}

export class UserRequest {
  username: string;
  password: string;
}
