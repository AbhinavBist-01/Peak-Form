import { randomBytes, createHmac } from "node:crypto";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  type SignInWithEmailAndPasswordInputType,
  signInWithEmailAndPasswordInput,
} from "./model";
import * as JWT from "jsonwebtoken";
import { db, eq } from "@repo/database";
import { generateUserToken, type GenerateUserTokenType } from "./model";
import { usersTable } from "@repo/database/models/user";
import { env } from "../env";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenType) {
    const { id } = await generateUserToken.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenType> {
    try {
      const verificationResult = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenType;
      return verificationResult;
    } catch (err) {
      throw new Error("Invalid token");
    }
  }

  public async getUserInfoById(id: string) {
    const user = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user || user.length === 0) throw new Error(`User with id ${id} does not exist`);
    return user[0];
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

    const userId = userInputResult[0].id;
    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInUserWithEmailAndPassword(payload: SignInWithEmailAndPasswordInputType) {
    const { email, password } = await signInWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new Error(`User with email ${email} does not exist`);

    if (!existingUser.salt || !existingUser.password) throw new Error("Invalid user data");

    const hash = createHmac("sha256", existingUser.salt).update(password).digest("hex");

    if (hash !== existingUser.password) throw new Error("Invalid credentials");

    const { token } = await this.generateUserToken({ id: existingUser.id });
    return {
      id: existingUser.id,
      token,
    };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return { id };
  }
}

export default UserService;
