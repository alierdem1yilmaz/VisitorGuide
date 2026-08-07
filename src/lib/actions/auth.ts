"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

function loginRedirectParams(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl");
  const intent = formData.get("intent");
  const params = new URLSearchParams({ error: "1" });
  if (typeof callbackUrl === "string" && callbackUrl) params.set("callbackUrl", callbackUrl);
  if (typeof intent === "string" && intent) params.set("intent", intent);
  return params.toString();
}

export async function signInWithCredentials(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl");
  const redirectTo = typeof callbackUrl === "string" && callbackUrl ? callbackUrl : "/";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?${loginRedirectParams(formData)}`);
    }
    throw error;
  }
}

export async function signUpWithCredentials(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = formData.get("callbackUrl");
  const redirectTo = typeof callbackUrl === "string" && callbackUrl ? callbackUrl : "/";

  if (!email || password.length < 8) {
    redirect(`/register?${loginRedirectParams(formData)}`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const params = new URLSearchParams(loginRedirectParams(formData));
    params.set("error", "exists");
    redirect(`/register?${params.toString()}`);
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: { name: name || null, email, passwordHash },
  });

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?${loginRedirectParams(formData)}`);
    }
    throw error;
  }
}
