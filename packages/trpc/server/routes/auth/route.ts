import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOuputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutputModel,
  logoutInputModel,
  logoutOutputModel,
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOuputModel,
} from "./model";
import { userService } from "../../services/index";
import { createAuthCookie, deleteAuthCookie } from "../../utils/cookie";
const TAGS = ["Authentication"];

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

  getLoggedInUserInfo: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getLoggedInUserInfo",
        tags: TAGS,
        summary: "Get information about the logged-in user",
        protect: true,
      },
    })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoOutputModel)
    .query(async ({ ctx }) => {
      const user = await userService.getUserInfoById(ctx.user.id);
      if (!user) {
        throw new Error("User not found");
      }
      const { id, fullName, email, role } = user;
      return { id, fullName, email, role };
    }),

  logout: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/logout",
        tags: TAGS,
        summary: "Clear the current auth cookie",
      },
    })
    .input(logoutInputModel)
    .output(logoutOutputModel)
    .mutation(async ({ ctx }) => {
      deleteAuthCookie(ctx);
      return { success: true };
    }),
});
