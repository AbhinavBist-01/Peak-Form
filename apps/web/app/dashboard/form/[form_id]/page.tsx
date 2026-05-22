import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    form_id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { form_id: formId } = await params;

  redirect(`/form/${formId}`);
}
