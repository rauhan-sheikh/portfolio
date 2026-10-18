import { ImageResponse } from "next/og";
import { OG_AVATAR } from "@/lib/og-avatar";

export const OG_SIZE = { width: 1200, height: 630 };

const ACCENT = "#7DBEFA";
const BG = "#0a0f1c";

export type OgContent = {
  /** Small label above the title, e.g. "Case study" */
  kicker: string;
  title: string;
  description?: string;
  tags?: string[];
  /** Larger hero treatment used by the homepage */
  hero?: boolean;
};

/** Per-page content for the static routes. */
export const OG_PAGES = {
  home: {
    kicker: "Open to opportunities",
    title: "Rauhan Sheikh",
    description: "I build things, break things, figure things out, and ship them.",
    tags: ["Backend", "Databases", "Reliability"],
    hero: true,
  },
  work: {
    kicker: "Work & systems",
    title: "Software that has to actually work",
    description: "Case studies in distributed systems, financial ledgers, and production tooling.",
    tags: ["Case studies", "Architecture", "Postmortems"],
  },
  writing: {
    kicker: "Writing",
    title: "Technical essays & engineering postmortems",
    description: "BullMQ queues, database indexing, financial ledgers, and API architecture.",
    tags: ["Queues", "Databases", "APIs"],
  },
  about: {
    kicker: "About",
    title: "From operations to software engineering",
    description: "The honest career journey, the principles, and the personality behind the code.",
    tags: ["Story", "Principles"],
  },
  experience: {
    kicker: "Experience",
    title: "Track record & systems shipped",
    description: "A career timeline of growing responsibility and the technical work that came with it.",
    tags: ["Timeline", "Impact"],
  },
  now: {
    kicker: "Now",
    title: "What I'm building, reading & learning",
    description: "A live snapshot of what has my attention right now.",
    tags: ["Building", "Reading", "Learning"],
  },
  resume: {
    kicker: "Résumé",
    title: "Rauhan Sheikh — Software Developer",
    description: "Experience, projects, and technical competencies in one place.",
    tags: ["Backend", "Databases", "TypeScript"],
  },
  contact: {
    kicker: "Contact",
    title: "Let's build something reliable",
    description: "Engineering roles, backend architecture, or consulting. Say hello.",
    tags: ["hello@rauhansheikh.com"],
  },
} satisfies Record<string, OgContent>;

function titleSize(title: string, hero?: boolean): number {
  if (hero) return 88;
  const n = title.length;
  if (n <= 24) return 76;
  if (n <= 44) return 64;
  if (n <= 70) return 54;
  return 46;
}

export function renderOg(content: OgContent) {
  const { kicker, title, description, tags = [], hero } = content;
  const avatar = hero ? 290 : 250;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: BG,
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* dotted grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(rgba(125,190,250,0.16) 2px, transparent 2px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* glow behind the avatar */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 760,
            height: 760,
            display: "flex",
            borderRadius: 760,
            background: "radial-gradient(circle, rgba(125,190,250,0.38) 0%, rgba(125,190,250,0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -200,
            bottom: -260,
            width: 640,
            height: 640,
            display: "flex",
            borderRadius: 640,
            background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0) 68%)",
          }}
        />
        {/* accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 10,
            display: "flex",
            background: `linear-gradient(180deg, ${ACCENT}, #6366f1)`,
          }}
        />

        {/* text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: hero ? 690 : 760,
            padding: "64px 0 56px 84px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                border: `2px solid ${hero ? "#34d399" : ACCENT}`,
                background: "rgba(10,15,28,0.8)",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: hero ? "#34d399" : ACCENT,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 14,
                  height: 14,
                  borderRadius: 14,
                  marginRight: 14,
                  background: hero ? "#34d399" : ACCENT,
                }}
              />
              {kicker}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: titleSize(title, hero),
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: -2,
                color: "#ffffff",
              }}
            >
              {title}
            </div>
            {hero && (
              <div style={{ display: "flex", marginTop: 10, fontSize: 44, fontWeight: 700, color: ACCENT }}>
                Software Developer
              </div>
            )}
            {description && (
              <div
                style={{
                  display: "flex",
                  marginTop: 26,
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "#cbd5e1",
                }}
              >
                {description}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {tags.length > 0 && (
              <div style={{ display: "flex", marginBottom: 26 }}>
                {tags.slice(0, 4).map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      marginRight: 12,
                      padding: "8px 18px",
                      borderRadius: 12,
                      background: "rgba(125,190,250,0.12)",
                      border: "1px solid rgba(125,190,250,0.35)",
                      fontSize: 22,
                      color: "#bfdbfe",
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#94a3b8" }}>
              <span style={{ color: ACCENT, fontWeight: 700 }}>rauhansheikh.com</span>
              {!hero && (
                <>
                  <span style={{ margin: "0 14px" }}>/</span>
                  <span>Backend · Databases · Reliability</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* avatar card */}
        <div
          style={{
            position: "absolute",
            right: hero ? 70 : 100,
            top: hero ? 150 : 150,
            display: "flex",
            transform: "rotate(4deg)",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 14,
              borderRadius: 52,
              background: "#0f1729",
              border: `3px solid ${ACCENT}`,
              boxShadow: "0 30px 80px rgba(125,190,250,0.35)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={OG_AVATAR}
              width={avatar}
              height={avatar}
              alt=""
              style={{ borderRadius: 38 }}
            />
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
