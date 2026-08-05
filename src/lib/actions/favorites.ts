"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const placeId = String(formData.get("placeId") ?? "");
  const path = String(formData.get("path") ?? "/");
  const userId = session.user.id;

  if (!placeId) {
    redirect(path);
  }

  const existing = await prisma.favorite.findUnique({
    where: { placeId_userId: { placeId, userId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { placeId, userId } });
  }

  revalidatePath(path);
  revalidatePath("/profile");
  redirect(path);
}
