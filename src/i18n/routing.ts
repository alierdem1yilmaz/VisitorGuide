import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "tr", "en", "de", "fr", "ru", "zh", "es", "hi", "pl",
    "pt", "it", "nl", "ja", "ko", "ar", "th", "vi", "id", "ms", "tl",
    "sv", "no", "da", "fi", "cs", "sk", "hu", "ro", "bg", "el", "he",
    "uk", "hr", "sr", "sl", "lt", "lv", "et", "is", "fa", "sw", "af",
    "bn", "ur", "ta", "mn", "ka", "hy", "az", "km",
  ],
  defaultLocale: "tr",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
