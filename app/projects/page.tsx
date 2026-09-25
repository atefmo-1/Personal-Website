import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Projects } from "@/components/Projects";
import { showProjects } from "@/lib/pages";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  if (!showProjects) notFound();
  return <Projects />;
}
