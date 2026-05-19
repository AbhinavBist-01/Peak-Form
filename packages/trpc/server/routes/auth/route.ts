import {
  createUserWithEmailAndPasswordInput,
  signInWithEmailAndPasswordInput,
} from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOuputModel,
} from "./model";
import {
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOuputModel,
} from "./model";
import { userService } from "../../services/index";
import { createAuthCookie } from "../../utils/cookie";
import UserService from "@repo/services/user";
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

  signInUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/signInUserWithEmailAndPassword",
        tags: TAGS,
        summary: "Sign in a user with email and password",
      },
    })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOuputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { id, token } = await userService.signInUserWithEmailAndPassword({
        email,
        password,
      });
      createAuthCookie(ctx, token);
      return { id };
    }),
});
