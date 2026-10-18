import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

/**
 * The single source of truth for the résumé. Both the /resume web page and the generated
 * /resume.pdf are built from getResumeData(), so they cannot drift apart.
 */

export type ResumeData = {
  name: string;
  summary: string;
  contact: {
    location: string;
    email: string;
    phone: string | null;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  experience: {
    role: string;
    company: string;
    location: string | null;
    start: string;
    end: string;
    bullets: string[];
    technologies: string[];
  }[];
  projects: { slug: string; title: string; blurb: string; url: string | null; personal: boolean }[];
  skills: { label: string; items: string[] }[];
  education: { institution: string; degree: string; period: string | null; detail: string | null }[];
};

function parseList(raw: string | null | undefined): string[] {
  try {
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

const strip = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * @param includePhone force the phone number on (admin download). Otherwise it is included only
 * when the `resume_show_phone` setting is "true".
 */
export async function getResumeData(opts: { includePhone?: boolean } = {}): Promise<ResumeData> {
  const [settingsList, experiences, projects, skills, education] = await Promise.all([
    db.siteSetting.findMany(),
    db.experience.findMany({ where: { showOnResume: true }, orderBy: { order: "asc" } }),
    db.project.findMany({ where: { showOnResume: true, status: "PUBLISHED" }, orderBy: { order: "asc" } }),
    db.skillGroup.findMany({ orderBy: { order: "asc" } }),
    db.education.findMany({ orderBy: { order: "asc" } }),
  ]);

  const s: Record<string, string> = {};
  settingsList.forEach((row) => {
    s[row.key] = row.value;
  });

  const wantPhone = opts.includePhone || s.resume_show_phone === "true";

  return {
    name: s.site_name || "Rauhan Sheikh",
    summary: s.resume_summary || "",
    contact: {
      location: s.resume_location || s.location || "India",
      email: s.email || "hello@rauhansheikh.com",
      phone: wantPhone && s.resume_phone ? s.resume_phone : null,
      linkedin: s.linkedin_url || "https://linkedin.com/in/rauhan-sheikh",
      github: s.github_url || "https://github.com/rauhan-sheikh",
      portfolio: SITE_URL,
    },
    experience: experiences.map((e) => {
      const short = parseList(e.resumeBullets);
      return {
        role: e.role,
        company: e.company,
        location: e.location,
        start: e.startDate,
        end: e.isCurrent ? "Present" : e.endDate || "",
        bullets: short.length ? short : parseList(e.bullets).slice(0, 4),
        technologies: parseList(e.technologies).slice(0, 10),
      };
    }),
    projects: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      blurb: p.resumeBlurb || p.shortDesc,
      url: p.liveUrl || null,
      personal: p.category === "PERSONAL",
    })),
    skills: skills.map((g) => ({ label: g.label, items: parseList(g.items) })),
    education: education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      period: e.period,
      detail: e.detail,
    })),
  };
}

export const displayUrl = strip;
