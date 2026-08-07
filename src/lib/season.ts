import { Season } from "@prisma/client";

/**
 * Northern hemisphere's warm half (Apr–Sep) maps to SUMMER, the cold half
 * (Oct–Mar) to WINTER. Southern-hemisphere latitudes get the mapping
 * flipped, since e.g. August is winter in Argentina, not summer.
 */
export function currentSeasonForLatitude(
  latitude: number | null | undefined,
  date = new Date(),
): Season {
  const month = date.getMonth(); // 0 = January
  const isNorthernWarmHalf = month >= 3 && month <= 8; // Apr–Sep
  const isSouthernHemisphere = latitude != null && latitude < 0;
  const isWarmHalf = isSouthernHemisphere ? !isNorthernWarmHalf : isNorthernWarmHalf;
  return isWarmHalf ? Season.SUMMER : Season.WINTER;
}
