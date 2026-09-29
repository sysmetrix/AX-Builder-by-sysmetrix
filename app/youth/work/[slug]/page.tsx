import type { Metadata } from "next";
import CaseStudy from "@/app/work/[slug]/page";
import { youthCaseStudyProjects } from "@/lib/catalog";
import { flows } from "@/lib/flows";
import { canonical, ogImagesFor, publicUrl, youthSiteName } from "@/lib/site";

export function generateStaticParams() {
  return youthCaseStudyProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = youthCaseStudyProjects.find((item) => item.slug === slug);
  if (!project) return {};
  const title = `${project.title} — Youth Worker Case Study`;
  const description = `${flows[slug]?.headline ?? ""} ${project.oneLiner}`.trim();
  return {
    title: { absolute: `${title} — ${youthSiteName}` }, description,
    alternates: canonical(`/work/${slug}`),
    openGraph: { type: "article", siteName: youthSiteName, locale: "ko_KR", title, description, url: publicUrl(`/youth/work/${slug}`), images: ogImagesFor(project.title, `Youth Work · ${youthSiteName}`) },
    twitter: { card: "summary_large_image", title, description, images: ogImagesFor(project.title, `Youth Work · ${youthSiteName}`) },
  };
}

export default function YouthCaseStudy(props: { params: Promise<{ slug: string }> }) {
  return <CaseStudy {...props} youth />;
}
