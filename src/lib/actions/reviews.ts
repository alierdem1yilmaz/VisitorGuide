"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

async function recomputePlaceRating(
  tx: Prisma.TransactionClient,
  placeId: string,
) {
  const agg = await tx.review.aggregate({
    where: { placeId },
    _avg: { rating: true },
    _count: true,
  });

  await tx.place.update({
    where: { id: placeId },
    data: {
      avgRating: agg._avg.rating ?? 0,
      reviewCount: agg._count,
    },
  });
}

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const placeId = String(formData.get("placeId") ?? "");
  const path = String(formData.get("path") ?? "/");
  const rating = Number(formData.get("rating"));
  const title = String(formData.get("title") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;

  if (!placeId || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    redirect(`${path}?reviewError=1`);
  }

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    await tx.review.upsert({
      where: { placeId_userId: { placeId, userId } },
      update: { rating, title, body },
      create: { placeId, userId, rating, title, body },
    });
    await recomputePlaceRating(tx, placeId);
  });

  revalidatePath(path);
  redirect(path);
}

export async function deleteReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const reviewId = String(formData.get("reviewId") ?? "");
  const placePath = String(formData.get("placePath") ?? "");
  const userId = session.user.id;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.userId !== userId) {
    redirect("/profile");
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await recomputePlaceRating(tx, review.placeId);
  });

  revalidatePath("/profile");
  if (placePath) revalidatePath(placePath);
  redirect("/profile");
}
