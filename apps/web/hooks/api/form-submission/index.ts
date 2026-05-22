import { trpc } from "~/trpc/client";

export const useCreateFormSubmission = () => {
  const {
    mutateAsync: createFormSubmissionAsync,
    mutate: createFormSubmission,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.formSubmission.createFormSubmission.useMutation();

  return {
    createFormSubmissionAsync,
    createFormSubmission,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};
