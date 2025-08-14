import type { Metadata } from "next";
import BriefsClient from "@/components/BriefsClient";

export const metadata: Metadata = {
  title: "Briefs — CityScout",
  description: "Search cities and open a printable relocation brief.",
};


export default function BriefsPage() {
  return <BriefsClient />;
}
