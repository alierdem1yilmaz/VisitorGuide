"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function SeasonToggle({
  allLabel,
  summerLabel,
  winterLabel,
}: {
  allLabel: string;
  summerLabel: string;
  winterLabel: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const season = searchParams.get("season") ?? "";

  function go(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("season", value);
    } else {
      params.delete("season");
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function tabClass(target: string) {
    return `rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
      season === target
        ? "bg-gold text-ink"
        : "border border-ink-text/15 bg-paper text-ink-text hover:bg-paper-2"
    }`;
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => go("")} className={tabClass("")}>
        {allLabel}
      </button>
      <button
        type="button"
        onClick={() => go("SUMMER")}
        className={tabClass("SUMMER")}
      >
        {summerLabel}
      </button>
      <button
        type="button"
        onClick={() => go("WINTER")}
        className={tabClass("WINTER")}
      >
        {winterLabel}
      </button>
    </div>
  );
}
