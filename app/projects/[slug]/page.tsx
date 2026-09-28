import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy";
import { showProjects } from "@/lib/pages";
import { projects } from "@/lib/projects";

// One page per project that has a case study; everything else 404s.
const withCaseStudy = projects.filter(
  (p): p is typeof p & { caseStudy: NonNullable<typeof p.caseStudy> } => !!p.caseStudy,
);

export const dynamicParams = false;

export function generateStaticParams() {
  return withCaseStudy.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = withCaseStudy.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.caseStudy.metaTitle ?? project.name,
    description: project.caseStudy.oneLiner,
    openGraph: { images: [project.caseStudy.hero.src] },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = withCaseStudy.find((p) => p.slug === params.slug);
  if (!showProjects || !project) notFound();
  return <CaseStudy project={project} />;
}
