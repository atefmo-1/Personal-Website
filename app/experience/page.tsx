import type { Metadata } from "next";
import { Experience } from "@/components/Experience";

export const metadata: Metadata = { title: "Work & Experience" };

export default function ExperiencePage() {
  return <Experience />;
}
