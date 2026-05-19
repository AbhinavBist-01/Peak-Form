import { createUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOuputModel,
} from "./model";
import { userService } from "../../services/index";
import { createAuthCookie } from "../../utils/cookie";
const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createUserWithEmailAndPassword",
        tags: TAGS,
        summary: "Create a new user with email and password",
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOuputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;

      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });
      createAuthCookie(ctx, token);
      return { id };
    }),
});
