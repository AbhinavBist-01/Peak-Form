import { trpc } from "~/trpc/client";
export const useSignup = () => {
  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation();

  return {
    createUserWithEmailAndPasswordAsync,
    createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useSignin = () => {
  const {
    mutateAsync: signInWithEmailAndPasswordAsync,
    mutate: signInWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.signInUserWithEmailAndPassword.useMutation();

  return {
    signInWithEmailAndPasswordAsync,
    signInWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};
