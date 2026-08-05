export type Region = {
  code: string;
  countryLabel: string;
  languageLabel: string;
  locale: string;
  currencyCode: string;
  flag: string;
};

// 52 region entries covering ~50 distinct languages (a couple of regions,
// like Canada's two, deliberately reuse an existing locale — mirroring how
// TripAdvisor itself splits one country into two region cards when it has
// two official languages). This is the data source for both tabs of the
// Preferences modal: the Region & Language grid directly, and the Currency
// tab via de-duplicated currencyCode values.
export const regions: Region[] = [
  { code: "tr", countryLabel: "Türkiye", languageLabel: "Türkçe", locale: "tr", currencyCode: "TRY", flag: "🇹🇷" },
  { code: "us", countryLabel: "United States", languageLabel: "English", locale: "en", currencyCode: "USD", flag: "🇺🇸" },
  { code: "de", countryLabel: "Deutschland", languageLabel: "Deutsch", locale: "de", currencyCode: "EUR", flag: "🇩🇪" },
  { code: "fr", countryLabel: "France", languageLabel: "Français", locale: "fr", currencyCode: "EUR", flag: "🇫🇷" },
  { code: "ru", countryLabel: "Россия", languageLabel: "Русский", locale: "ru", currencyCode: "RUB", flag: "🇷🇺" },
  { code: "cn", countryLabel: "中国", languageLabel: "中文", locale: "zh", currencyCode: "CNY", flag: "🇨🇳" },
  { code: "es", countryLabel: "España", languageLabel: "Español", locale: "es", currencyCode: "EUR", flag: "🇪🇸" },
  { code: "in-hi", countryLabel: "India", languageLabel: "हिन्दी", locale: "hi", currencyCode: "INR", flag: "🇮🇳" },
  { code: "pl", countryLabel: "Polska", languageLabel: "Polski", locale: "pl", currencyCode: "PLN", flag: "🇵🇱" },

  { code: "br", countryLabel: "Brasil", languageLabel: "Português", locale: "pt", currencyCode: "BRL", flag: "🇧🇷" },
  { code: "it", countryLabel: "Italia", languageLabel: "Italiano", locale: "it", currencyCode: "EUR", flag: "🇮🇹" },
  { code: "nl", countryLabel: "Nederland", languageLabel: "Nederlands", locale: "nl", currencyCode: "EUR", flag: "🇳🇱" },
  { code: "jp", countryLabel: "日本", languageLabel: "日本語", locale: "ja", currencyCode: "JPY", flag: "🇯🇵" },
  { code: "kr", countryLabel: "대한민국", languageLabel: "한국어", locale: "ko", currencyCode: "KRW", flag: "🇰🇷" },
  { code: "ae", countryLabel: "الإمارات العربية المتحدة", languageLabel: "العربية", locale: "ar", currencyCode: "AED", flag: "🇦🇪" },
  { code: "th", countryLabel: "ประเทศไทย", languageLabel: "ไทย", locale: "th", currencyCode: "THB", flag: "🇹🇭" },
  { code: "vn", countryLabel: "Việt Nam", languageLabel: "Tiếng Việt", locale: "vi", currencyCode: "VND", flag: "🇻🇳" },
  { code: "id", countryLabel: "Indonesia", languageLabel: "Bahasa Indonesia", locale: "id", currencyCode: "IDR", flag: "🇮🇩" },
  { code: "my", countryLabel: "Malaysia", languageLabel: "Bahasa Melayu", locale: "ms", currencyCode: "MYR", flag: "🇲🇾" },
  { code: "ph", countryLabel: "Pilipinas", languageLabel: "Filipino", locale: "tl", currencyCode: "PHP", flag: "🇵🇭" },
  { code: "se", countryLabel: "Sverige", languageLabel: "Svenska", locale: "sv", currencyCode: "SEK", flag: "🇸🇪" },
  { code: "no", countryLabel: "Norge", languageLabel: "Norsk", locale: "no", currencyCode: "NOK", flag: "🇳🇴" },
  { code: "dk", countryLabel: "Danmark", languageLabel: "Dansk", locale: "da", currencyCode: "DKK", flag: "🇩🇰" },
  { code: "fi", countryLabel: "Suomi", languageLabel: "Suomi", locale: "fi", currencyCode: "EUR", flag: "🇫🇮" },
  { code: "cz", countryLabel: "Česko", languageLabel: "Čeština", locale: "cs", currencyCode: "CZK", flag: "🇨🇿" },
  { code: "sk", countryLabel: "Slovensko", languageLabel: "Slovenčina", locale: "sk", currencyCode: "EUR", flag: "🇸🇰" },
  { code: "hu", countryLabel: "Magyarország", languageLabel: "Magyar", locale: "hu", currencyCode: "HUF", flag: "🇭🇺" },
  { code: "ro", countryLabel: "România", languageLabel: "Română", locale: "ro", currencyCode: "RON", flag: "🇷🇴" },
  { code: "bg", countryLabel: "България", languageLabel: "Български", locale: "bg", currencyCode: "BGN", flag: "🇧🇬" },
  { code: "gr", countryLabel: "Ελλάδα", languageLabel: "Ελληνικά", locale: "el", currencyCode: "EUR", flag: "🇬🇷" },
  { code: "il", countryLabel: "ישראל", languageLabel: "עברית", locale: "he", currencyCode: "ILS", flag: "🇮🇱" },
  { code: "ua", countryLabel: "Україна", languageLabel: "Українська", locale: "uk", currencyCode: "UAH", flag: "🇺🇦" },
  { code: "hr", countryLabel: "Hrvatska", languageLabel: "Hrvatski", locale: "hr", currencyCode: "EUR", flag: "🇭🇷" },
  { code: "rs", countryLabel: "Srbija", languageLabel: "Srpski", locale: "sr", currencyCode: "RSD", flag: "🇷🇸" },
  { code: "si", countryLabel: "Slovenija", languageLabel: "Slovenščina", locale: "sl", currencyCode: "EUR", flag: "🇸🇮" },
  { code: "lt", countryLabel: "Lietuva", languageLabel: "Lietuvių", locale: "lt", currencyCode: "EUR", flag: "🇱🇹" },
  { code: "lv", countryLabel: "Latvija", languageLabel: "Latviešu", locale: "lv", currencyCode: "EUR", flag: "🇱🇻" },
  { code: "ee", countryLabel: "Eesti", languageLabel: "Eesti", locale: "et", currencyCode: "EUR", flag: "🇪🇪" },
  { code: "is", countryLabel: "Ísland", languageLabel: "Íslenska", locale: "is", currencyCode: "ISK", flag: "🇮🇸" },
  { code: "ir", countryLabel: "ایران", languageLabel: "فارسی", locale: "fa", currencyCode: "IRR", flag: "🇮🇷" },
  { code: "ke", countryLabel: "Kenya", languageLabel: "Kiswahili", locale: "sw", currencyCode: "KES", flag: "🇰🇪" },
  { code: "za", countryLabel: "South Africa", languageLabel: "Afrikaans", locale: "af", currencyCode: "ZAR", flag: "🇿🇦" },
  { code: "bd", countryLabel: "বাংলাদেশ", languageLabel: "বাংলা", locale: "bn", currencyCode: "BDT", flag: "🇧🇩" },
  { code: "pk", countryLabel: "پاکستان", languageLabel: "اردو", locale: "ur", currencyCode: "PKR", flag: "🇵🇰" },
  { code: "lk", countryLabel: "இலங்கை", languageLabel: "தமிழ்", locale: "ta", currencyCode: "LKR", flag: "🇱🇰" },
  { code: "mn", countryLabel: "Монгол улс", languageLabel: "Монгол", locale: "mn", currencyCode: "MNT", flag: "🇲🇳" },
  { code: "ge", countryLabel: "საქართველო", languageLabel: "ქართული", locale: "ka", currencyCode: "GEL", flag: "🇬🇪" },
  { code: "am", countryLabel: "Հայաստան", languageLabel: "Հայերեն", locale: "hy", currencyCode: "AMD", flag: "🇦🇲" },
  { code: "az", countryLabel: "Azərbaycan", languageLabel: "Azərbaycan dili", locale: "az", currencyCode: "AZN", flag: "🇦🇿" },
  { code: "kh", countryLabel: "កម្ពុជា", languageLabel: "ខ្មែរ", locale: "km", currencyCode: "KHR", flag: "🇰🇭" },

  { code: "ca-en", countryLabel: "Canada (English)", languageLabel: "English", locale: "en", currencyCode: "CAD", flag: "🇨🇦" },
  { code: "ca-fr", countryLabel: "Canada (Français)", languageLabel: "Français", locale: "fr", currencyCode: "CAD", flag: "🇨🇦" },
];

export const currencyOptions: string[] = Array.from(
  new Set(regions.map((r) => r.currencyCode)),
).sort();
