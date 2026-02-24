import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPage } from "@/components/auth/login-page";

export const metadata = {
  title: "Sign in - Sentinel",
  description: "Sign in to Sentinel fraud detection platform",
};

export default async function Login() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <LoginPage />;
}
