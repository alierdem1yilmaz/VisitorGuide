import { prisma } from "@/lib/prisma";
import { PLACE_CHUNK_SIZE } from "@/lib/sitemapConfig";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export async function GET() {
  const totalPlaces = await prisma.place.count();
  const placeChunks = Math.ceil(totalPlaces / PLACE_CHUNK_SIZE);
  const chunkCount = placeChunks + 1;

  const entries = Array.from(
    { length: chunkCount },
    (_, id) => `  <sitemap><loc>${siteUrl}/sitemap/${id}.xml</loc></sitemap>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
