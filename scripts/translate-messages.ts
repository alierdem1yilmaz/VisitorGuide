import fs from "fs";
import path from "path";
import { routing } from "../src/i18n/routing";

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!API_KEY) {
  throw new Error("GOOGLE_TRANSLATE_API_KEY is not set");
}

const MESSAGES_DIR = path.join(__dirname, "..", "messages");
const SOURCE_LOCALE = "en";
const BATCH_SIZE = 100;

type Flat = Record<string, string>;

function flatten(obj: Record<string, unknown>, prefix = ""): Flat {
  const result: Flat = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(result, flatten(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

function unflatten(flat: Flat): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] ?? {};
      cur = cur[parts[i]] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value;
  }
  return result;
}

// Only the two ICU plural keys (common.cityCount, common.placeCount) match
// this shape, and both follow the fixed "# <noun>" pattern in the English
// source. Translating the bare noun alone (never embedding `#` or a
// placeholder token in the text sent to the API) is what's reliable —
// earlier attempts that sent "PLACEHOLDER cities" as a sentence saw Google
// Translate drop, relocate, or partially transliterate the token for
// several languages (e.g. Arabic, Thai, Slovak, Afrikaans). next-intl
// accepts "other" alone for any cardinality, so a single-category plural
// string stays correct even without language-specific one/few/many forms.
const OTHER_RE = /other\s*\{#\s*([^}]*)\}/;

function isPluralString(value: string): boolean {
  return value.startsWith("{count, plural,");
}

function extractOtherNoun(value: string): string {
  const match = value.match(OTHER_RE);
  return match ? match[1].trim() : value;
}

function rebuildPluralString(translatedNoun: string): string {
  return `{count, plural, other {# ${translatedNoun}}}`;
}

async function translateBatch(texts: string[], target: string): Promise<string[]> {
  if (texts.length === 0) return [];
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const body = new URLSearchParams();
  for (const t of texts) body.append("q", t);
  body.append("source", SOURCE_LOCALE);
  body.append("target", target);
  body.append("format", "text");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Translate API error for "${target}": ${res.status} ${errText}`);
  }
  const data = await res.json();
  return data.data.translations.map(
    (t: { translatedText: string }) => t.translatedText,
  );
}

async function translateLocale(
  locale: string,
  sourceFlat: Flat,
  existingFlat: Flat,
): Promise<Flat> {
  const missingKeys = Object.keys(sourceFlat).filter((k) => !(k in existingFlat));
  const result: Flat = { ...existingFlat };
  if (missingKeys.length === 0) return result;

  const normalKeys = missingKeys.filter((k) => !isPluralString(sourceFlat[k]));
  const pluralKeys = missingKeys.filter((k) => isPluralString(sourceFlat[k]));

  for (let i = 0; i < normalKeys.length; i += BATCH_SIZE) {
    const batchKeys = normalKeys.slice(i, i + BATCH_SIZE);
    const translated = await translateBatch(
      batchKeys.map((k) => sourceFlat[k]),
      locale,
    );
    batchKeys.forEach((k, idx) => {
      result[k] = translated[idx];
    });
  }

  if (pluralKeys.length > 0) {
    const nouns = pluralKeys.map((k) => extractOtherNoun(sourceFlat[k]));
    const translated = await translateBatch(nouns, locale);
    pluralKeys.forEach((k, idx) => {
      result[k] = rebuildPluralString(translated[idx]);
    });
  }

  return result;
}

async function main() {
  const sourceRaw = JSON.parse(
    fs.readFileSync(path.join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`), "utf8"),
  );
  const sourceFlat = flatten(sourceRaw);

  for (const locale of routing.locales) {
    if (locale === SOURCE_LOCALE) continue;
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);

    let existingFlat: Flat = {};
    if (fs.existsSync(filePath)) {
      existingFlat = flatten(JSON.parse(fs.readFileSync(filePath, "utf8")));
    }

    const missingCount = Object.keys(sourceFlat).filter(
      (k) => !(k in existingFlat),
    ).length;
    if (missingCount === 0) {
      console.log(`${locale}: up to date`);
      continue;
    }

    console.log(`${locale}: translating ${missingCount} missing key(s)...`);
    try {
      const resultFlat = await translateLocale(locale, sourceFlat, existingFlat);
      const orderedFlat: Flat = {};
      for (const k of Object.keys(sourceFlat)) orderedFlat[k] = resultFlat[k];
      const nested = unflatten(orderedFlat);
      fs.writeFileSync(filePath, JSON.stringify(nested, null, 2) + "\n", "utf8");
      console.log(`${locale}: wrote ${filePath}`);
    } catch (err) {
      console.error(`${locale}: FAILED —`, err instanceof Error ? err.message : err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
