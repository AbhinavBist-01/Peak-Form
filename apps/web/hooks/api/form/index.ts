import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useListForms = () => {
  const {
    data: forms,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.form.listForms.useQuery();

  return {
    forms,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useListPublicForms = () => {
  const {
    data: forms,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.form.listPublicForms.useQuery();

  return {
    forms,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.deleteForm.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    deleteFormAsync,
    deleteForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useArchiveForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: archiveFormAsync,
    mutate: archiveForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.archiveForm.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    archiveFormAsync,
    archiveForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useCloneForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: cloneFormAsync,
    mutate: cloneForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.cloneForm.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    cloneFormAsync,
    cloneForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useUpdateFormSettings = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFormSettingsAsync,
    mutate: updateFormSettings,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.updateFormSettings.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    updateFormSettingsAsync,
    updateFormSettings,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const usePublishForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: publishFormAsync,
    mutate: publishForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.publishForm.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    publishFormAsync,
    publishForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useUnpublishForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: unpublishFormAsync,
    mutate: unpublishForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.unpublishForm.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    unpublishFormAsync,
    unpublishForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useGetFormById = (formId: string, password?: string) => {
  const {
    data: form,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.form.getFormById.useQuery({ formId, password }, { enabled: Boolean(formId) });

  return {
    form,
    fields: form?.fields,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useGetFormForEditor = (formId: string) => {
  const {
    data: form,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.form.getFormForEditor.useQuery({ formId }, { enabled: Boolean(formId) });

  return {
    form,
    fields: form?.fields,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

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

export const useGetFormSubmissionsByFormId = (
  formId: string,
  options?: { page?: number; pageSize?: number; search?: string },
) => {
  const {
    data: submissions,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.formSubmission.getFormSubmissionsByFormId.useQuery(
    { formId, page: options?.page ?? 1, pageSize: options?.pageSize ?? 10, search: options?.search },
    { enabled: Boolean(formId) },
  );

  return {
    submissions: submissions?.submissions,
    submissionPage: submissions,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useGetFormSubmissionAnalytics = (formId: string) => {
  const {
    data: analytics,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.formSubmission.getFormSubmissionAnalytics.useQuery(
    { formId },
    { enabled: Boolean(formId) },
  );

  return {
    analytics,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useGetFormSubmissionById = (submissionId: string | null) => {
  const {
    data: submission,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.formSubmission.getFormSubmissionById.useQuery(
    { submissionId: submissionId ?? "" },
    { enabled: Boolean(submissionId) },
  );

  return {
    submission,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useDeleteFormSubmission = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormSubmissionAsync,
    mutate: deleteFormSubmission,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.formSubmission.deleteFormSubmission.useMutation({
    onSuccess: () => {
      utils.formSubmission.invalidate();
    },
  });

  return {
    deleteFormSubmissionAsync,
    deleteFormSubmission,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useExportFormSubmissionsCsv = () => {
  const utils = trpc.useUtils();

  return {
    exportFormSubmissionsCsvAsync: (formId: string) =>
      utils.formSubmission.exportFormSubmissionsCsv.fetch({ formId }),
  };
};

export const useGetAdminOverview = () => {
  const {
    data: overview,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.form.getAdminOverview.useQuery();

  return {
    overview,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useCreateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFieldAsync,
    mutate: createField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.createField.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    createFieldAsync,
    createField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useGetFields = (formId: string) => {
  const {
    data: fields,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = trpc.form.getFields.useQuery({ formId }, { enabled: Boolean(formId) });

  return {
    fields,
    error,
    failureCount,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFieldAsync,
    mutate: updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.updateField.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    updateFieldAsync,
    updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFieldAsync,
    mutate: deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.form.deleteField.useMutation({
    onSuccess: () => {
      utils.form.invalidate();
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};
