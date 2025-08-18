export type GeoLevel = "place" | "cbsa" | "county" | "state";

export interface City {
  // identity
  slug: string;          // "washington-dc"
  name: string;          // "Washington"
  state: string;         // "DC"

  // geography references (fill what you have; leave others null for now)
  state_fips?: string | null;   // e.g., "11"
  place_geoid?: string | null;  // e.g., "1150000"
  county_fips?: string | null;  // e.g., "11001"
  cbsa_code?: string | null;    // e.g., "47900"
  geo_level?: GeoLevel | null;  // primary level this row represents (usually "place")

  // population
  pop?: number | null;          // optional; avoids crashes if missing

  // core metrics (free tier 10)
  rpp: number;                  // BEA RPP (lower = cheaper)
  rentIndex: number;            // rent index (Zillow or your normalized scale)
  incomeMedian: number;         // USD
  diversityIndex: number;       // 0–1 (Simpson’s)
  internetMbps: number;         // median speed
  parksPer10k: number;
  cafesPer10k: number;
  barsPer10k: number;
  climate: string;

  // newly added (optional for now)
  commuteMedian?: number | null;   // minutes (ACS)
  transitShare?: number | null;    // percent 0–100 (ACS)
}
