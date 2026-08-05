"use server";

import { cookies } from "next/headers";
import { CURRENCY_COOKIE } from "@/lib/constants";

export async function setCurrencyCookie(code: string) {
  const store = await cookies();
  store.set(CURRENCY_COOKIE, code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
