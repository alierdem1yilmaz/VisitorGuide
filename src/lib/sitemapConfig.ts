// Shared between src/app/sitemap.ts and src/app/sitemap-index.xml/route.ts
// so the chunk count used to build the index always matches the chunk
// count generateSitemaps() actually produces.
export const PLACE_CHUNK_SIZE = 150;
