
import { redirect } from "next/navigation";
import { hasValidResetToken } from "~/server/action";
import ResetPasswordForm from "./ResetPasswordForm";

type Props = {
  searchParams: {
    token?: string;
  }
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  if (!searchParams.token) redirect('/auth/sign-in');

  try {
    const result = await hasValidResetToken(searchParams.token);
    return <ResetPasswordForm email={result.email} token={searchParams.token} />;
  } catch (error) {
    redirect('/auth/sign-in');
  }
}