import type { City } from "@/lib/types";

export type MetricDef = {
  key: keyof City;
  label: string;
  category: "cost" | "income" | "internet" | "amenities" | "mobility" | "demographics";
  better: "higher" | "lower" | "neutral";
  format: "number" | "money" | "percent" | "index";
  free: boolean;
  source: "BEA" | "Zillow" | "ACS" | "Ookla" | "OSM" | "Other";
  preferredGeo?: readonly ("place" | "cbsa" | "county" | "state")[];
};

export const METRICS: MetricDef[] = [
  { key: "rpp",            label: "Affordability (RPP)", category: "cost",   better: "lower",  format: "index",  free: true,  source: "BEA",   preferredGeo: ["cbsa","state"] },
  { key: "rentIndex",      label: "Rent Index",          category: "cost",   better: "lower",  format: "index",  free: true,  source: "Zillow",preferredGeo: ["cbsa","county","place"] },
  { key: "incomeMedian",   label: "Median Household Income", category: "income", better: "higher", format: "money", free: true, source: "ACS", preferredGeo: ["place","cbsa","county"] },
  { key: "diversityIndex", label: "Diversity Index (0–1)",   category: "demographics", better: "higher", format: "number", free: true, source: "ACS", preferredGeo: ["place","cbsa","county"] },
  { key: "internetMbps",   label: "Internet Median Mbps",    category: "internet", better: "higher", format: "number", free: true, source: "Ookla", preferredGeo: ["place","cbsa","county"] },
  { key: "parksPer10k",    label: "Parks per 10k",           category: "amenities", better: "higher", format: "number", free: true, source: "OSM", preferredGeo: ["place"] },
  { key: "cafesPer10k",    label: "Cafes per 10k",           category: "amenities", better: "higher", format: "number", free: true, source: "OSM", preferredGeo: ["place"] },
  { key: "barsPer10k",     label: "Bars per 10k",            category: "amenities", better: "higher", format: "number", free: true, source: "OSM", preferredGeo: ["place"] },
  { key: "commuteMedian",  label: "Median Commute (min)",    category: "mobility",  better: "lower",  format: "number", free: true, source: "ACS", preferredGeo: ["place","cbsa","county"] },
  { key: "transitShare",   label: "Transit share (% workers)", category: "mobility", better: "higher", format: "percent", free: true, source: "ACS", preferredGeo: ["place","cbsa","county"] },
];
