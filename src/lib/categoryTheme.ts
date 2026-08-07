import { Category } from "@prisma/client";

export const CATEGORY_THEME: Record<
  Category,
  { chip: string; chipText: string; scrimFrom: string }
> = {
  RESTAURANT: { chip: "bg-rust", chipText: "text-white", scrimFrom: "from-rust/70" },
  MONUMENT: { chip: "bg-gold", chipText: "text-ink", scrimFrom: "from-gold/60" },
  NATURE: { chip: "bg-teal", chipText: "text-white", scrimFrom: "from-teal/70" },
  ATTRACTION: { chip: "bg-steel", chipText: "text-white", scrimFrom: "from-steel/70" },
  HOTEL: { chip: "bg-gold-soft", chipText: "text-ink", scrimFrom: "from-gold-soft/60" },
};
