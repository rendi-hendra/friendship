import { z, ZodType } from 'zod';

export class FriendValidation {
  static readonly SendRequest: ZodType = z.object({
    friendId: z.number().min(1),
  });
}
