import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import ResumeDocument from "@/components/resume/ResumeDocument";
import type { ResumeData } from "@/lib/resume";

/** Render the résumé to PDF bytes. (react-pdf wants a <Document> element; the cast is the documented workaround.) */
export async function renderResumePdf(data: ResumeData): Promise<Uint8Array> {
  const element = createElement(ResumeDocument, { data }) as unknown as ReactElement<DocumentProps>;
  return new Uint8Array(await renderToBuffer(element));
}
