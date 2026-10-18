import React from "react";
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { displayUrl, type ResumeData } from "@/lib/resume";

/**
 * One-page US Letter résumé (classic single-column layout: summary, experience, projects,
 * skills, education). Rendered server-side by app/resume.pdf/route.ts from getResumeData().
 * Built-in Helvetica only, so text must stay within WinAnsi (see safe()).
 */

const INK = "#111111";
const MUTED = "#444444";
const ACCENT = "#1d4ed8";

const styles = StyleSheet.create({
  page: { paddingTop: 30, paddingBottom: 26, paddingHorizontal: 36, fontFamily: "Helvetica", fontSize: 8.6, color: INK, lineHeight: 1.28 },
  name: { fontSize: 19, fontFamily: "Helvetica-Bold", textAlign: "center", letterSpacing: 1.2, lineHeight: 1.15, marginBottom: 5 },
  contact: { textAlign: "center", fontSize: 8.4, color: MUTED, marginTop: 3, marginBottom: 2 },
  link: { color: ACCENT, textDecoration: "none" },
  sectionTitle: { fontSize: 9.2, fontFamily: "Helvetica-Bold", letterSpacing: 0.8, marginTop: 8, paddingBottom: 1.5, borderBottomWidth: 0.8, borderBottomColor: INK, borderBottomStyle: "solid", marginBottom: 3.5 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  rowLeft: { flexGrow: 1, flexShrink: 1, paddingRight: 8 },
  rowRight: { fontSize: 8.4, color: MUTED },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 9 },
  company: { fontFamily: "Helvetica-Bold", fontSize: 9, color: INK },
  bullet: { flexDirection: "row", marginTop: 1.2 },
  bulletDot: { width: 9, fontSize: 8.6 },
  bulletText: { flex: 1 },
  tech: { marginTop: 1.6, fontFamily: "Helvetica-Oblique", color: MUTED },
  entryGap: { marginTop: 4.5 },
  skillRow: { flexDirection: "row", marginTop: 1 },
  skillLabel: { width: 118, fontFamily: "Helvetica-Bold" },
  skillItems: { flex: 1 },
});

/** Replace characters that Helvetica (WinAnsi) cannot draw. */
const safe = (t: string) =>
  t
    .replace(/→/g, "to")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/[→↔]/g, "-")
    .replace(/[  ]/g, " ");

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((b, i) => (
        <View key={i} style={styles.bullet} wrap={false}>
          <Text style={styles.bulletDot}>{"•"}</Text>
          <Text style={styles.bulletText}>{safe(b)}</Text>
        </View>
      ))}
    </>
  );
}

export default function ResumeDocument({ data }: { data: ResumeData }) {
  const { contact } = data;
  const parts: React.ReactNode[] = [
    contact.location,
    ...(contact.phone ? [contact.phone] : []),
    <Link key="mail" src={`mailto:${contact.email}`} style={styles.link}>{contact.email}</Link>,
    <Link key="li" src={contact.linkedin} style={styles.link}>LinkedIn</Link>,
    <Link key="gh" src={contact.github} style={styles.link}>GitHub</Link>,
    <Link key="site" src={contact.portfolio} style={styles.link}>{displayUrl(contact.portfolio)}</Link>,
  ];

  return (
    <Document title={`${data.name} - Resume`} author={data.name} subject="Resume">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{data.name.toUpperCase()}</Text>
        <Text style={styles.contact}>
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 ? "  |  " : ""}
              {p}
            </React.Fragment>
          ))}
        </Text>

        {data.summary ? (
          <>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text>{safe(data.summary)}</Text>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
        {data.experience.map((e, i) => (
          <View key={i} style={i > 0 ? styles.entryGap : undefined} wrap={false}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text>
                  <Text style={styles.entryTitle}>{safe(e.role)}</Text>
                  <Text> | </Text>
                  <Text style={styles.company}>{safe(e.company)}</Text>
                </Text>
              </View>
              <Text style={styles.rowRight}>
                {safe(`${e.start}${e.end ? ` – ${e.end}` : ""}`)}
                {e.location ? safe(`  |  ${e.location}`) : ""}
              </Text>
            </View>
            <Bullets items={e.bullets} />
            {e.technologies.length ? <Text style={styles.tech}>Tech Stack: {safe(e.technologies.join(", "))}</Text> : null}
          </View>
        ))}

        {data.projects.length ? (
          <>
            <Text style={styles.sectionTitle}>SELECTED PROJECTS</Text>
            {data.projects.map((p, i) => (
              <View key={i} style={i > 0 ? { marginTop: 2.5 } : undefined} wrap={false}>
                <Text>
                  <Text style={styles.entryTitle}>{safe(p.title)}</Text>
                  {p.url ? (
                    <Text>
                      {"  "}
                      <Link src={p.url} style={styles.link}>{displayUrl(p.url)}</Link>
                    </Text>
                  ) : null}
                </Text>
                <Text>{safe(p.blurb)}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.skills.length ? (
          <>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            {data.skills.map((g, i) => (
              <View key={i} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillLabel}>{safe(g.label)}:</Text>
                <Text style={styles.skillItems}>{safe(g.items.join(", "))}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.education.length ? (
          <>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {data.education.map((e, i) => (
              <View key={i} style={[styles.row, { marginTop: i ? 1.5 : 0 }]} wrap={false}>
                <Text>
                  <Text style={styles.entryTitle}>{safe(e.degree)}</Text>
                  <Text>{safe(`  –  ${e.institution}`)}</Text>
                </Text>
                <Text style={styles.rowRight}>{safe([e.period, e.detail].filter(Boolean).join(" | "))}</Text>
              </View>
            ))}
          </>
        ) : null}
      </Page>
    </Document>
  );
}
