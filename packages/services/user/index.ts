import { randomBytes, createHmac } from "node:crypto";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
} from "./model";
import { db, eq } from "@repo/database";

import { usersTable } from "@repo/database/models/user";
class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new Error(`User with email ${email} already exists`);

    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const userInputResult = await db
      .insert(usersTable)
      .values({
        fullName,
        email,
        password: hash,
        salt,
      })
      .returning({
        id: usersTable.id,
      });

    if (!userInputResult || userInputResult.length === 0 || !userInputResult[0]?.id)
      throw new Error("Failed to create user");

    return {
      id: userInputResult[0]?.id,
    };
  }
}

export default UserService;
