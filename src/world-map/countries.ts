/**
 * Country reference data for the world-map component.
 *
 * Keys are ISO 3166-1 alpha-2 codes (upper-case). Each entry carries a
 * human-readable name plus the centroid lon/lat used by consumers that
 * project markers onto the simple-world-map SVG (the previous network-
 * dashboard rendered satellite markers via these centroids; the current
 * shared component highlights country paths instead but the centroids
 * are kept for downstream consumers).
 *
 * Coverage: the set of countries the simple-world-map SVG ships paths
 * for. Adding a code here without a matching `<g id="XX">` in the SVG
 * is a no-op — the renderer ignores unmatched codes.
 */

export interface CountryInfo {
  name: string;
  lon: number;
  lat: number;
}

export const COUNTRIES: Record<string, CountryInfo> = {
  // Americas
  US: { name: "United States", lon: -98, lat: 39 },
  CA: { name: "Canada", lon: -106, lat: 56 },
  MX: { name: "Mexico", lon: -102, lat: 23 },
  BR: { name: "Brazil", lon: -51, lat: -14 },
  AR: { name: "Argentina", lon: -64, lat: -34 },
  CL: { name: "Chile", lon: -71, lat: -35 },
  CO: { name: "Colombia", lon: -74, lat: 4 },
  PE: { name: "Peru", lon: -76, lat: -10 },
  UY: { name: "Uruguay", lon: -56, lat: -33 },
  PY: { name: "Paraguay", lon: -58, lat: -23 },
  EC: { name: "Ecuador", lon: -78, lat: -2 },
  VE: { name: "Venezuela", lon: -66, lat: 8 },
  CR: { name: "Costa Rica", lon: -84, lat: 10 },
  PA: { name: "Panama", lon: -80, lat: 9 },

  // Europe
  GB: { name: "United Kingdom", lon: -2, lat: 54 },
  DE: { name: "Germany", lon: 10, lat: 51 },
  FR: { name: "France", lon: 2, lat: 46 },
  ES: { name: "Spain", lon: -4, lat: 40 },
  IT: { name: "Italy", lon: 12, lat: 42 },
  CH: { name: "Switzerland", lon: 8, lat: 47 },
  NL: { name: "Netherlands", lon: 5, lat: 52 },
  SE: { name: "Sweden", lon: 18, lat: 60 },
  NO: { name: "Norway", lon: 10, lat: 62 },
  FI: { name: "Finland", lon: 26, lat: 64 },
  PT: { name: "Portugal", lon: -8, lat: 39 },
  IE: { name: "Ireland", lon: -8, lat: 53 },
  PL: { name: "Poland", lon: 20, lat: 52 },
  AT: { name: "Austria", lon: 14, lat: 47 },
  BE: { name: "Belgium", lon: 4, lat: 51 },
  UA: { name: "Ukraine", lon: 32, lat: 49 },
  RU: { name: "Russia", lon: 40, lat: 56 },

  // Africa
  NG: { name: "Nigeria", lon: 8, lat: 10 },
  ZA: { name: "South Africa", lon: 25, lat: -29 },
  KE: { name: "Kenya", lon: 38, lat: 0 },
  EG: { name: "Egypt", lon: 30, lat: 27 },
  MA: { name: "Morocco", lon: -5, lat: 32 },
  GH: { name: "Ghana", lon: -2, lat: 8 },

  // Middle East
  AE: { name: "UAE", lon: 54, lat: 24 },
  SA: { name: "Saudi Arabia", lon: 45, lat: 24 },
  IL: { name: "Israel", lon: 35, lat: 31 },
  TR: { name: "Turkey", lon: 32, lat: 39 },

  // Asia
  IN: { name: "India", lon: 78, lat: 21 },
  CN: { name: "China", lon: 104, lat: 35 },
  JP: { name: "Japan", lon: 138, lat: 36 },
  KR: { name: "South Korea", lon: 128, lat: 36 },
  SG: { name: "Singapore", lon: 104, lat: 1 },
  TH: { name: "Thailand", lon: 101, lat: 15 },
  VN: { name: "Vietnam", lon: 108, lat: 14 },
  ID: { name: "Indonesia", lon: 113, lat: -1 },
  PH: { name: "Philippines", lon: 122, lat: 13 },
  MY: { name: "Malaysia", lon: 102, lat: 4 },

  // Oceania
  AU: { name: "Australia", lon: 133, lat: -25 },
  NZ: { name: "New Zealand", lon: 174, lat: -41 },
};

export function getCountryName(code: string): string {
  return COUNTRIES[code.toUpperCase()]?.name ?? code;
}
