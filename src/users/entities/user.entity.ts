// eslint-disable-next-line prettier/prettier
import { User } from "@prisma/client";

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;
  adm: boolean;
  createAt: Date;
}
