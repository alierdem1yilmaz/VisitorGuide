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
    return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      season === target
        ? "bg-brand-600 text-white"
        : "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50"
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
