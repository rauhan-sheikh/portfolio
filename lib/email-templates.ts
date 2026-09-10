import { escapeHtml, getSiteUrl, type OutgoingEmail } from "./email";

/**
 * Plain functions returning OutgoingEmail. No react-email — that is ~15
 * transitive packages for four templates.
 *
 * Everything is inline-styled: mail clients strip <style> blocks, and Tailwind
 * classes mean nothing here. Layout is table-based for Outlook.
 */

// Structural types, so templates do not depend on generated Prisma types.
interface ContactLike {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: Date;
}

interface SubscriberLike {
  email: string;
  confirmToken: string;
  unsubscribeToken: string;
}

interface ArticleLike {
  title: string;
  slug: string;
  excerpt: string;
  readingTime: string;
}

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
const INK = "#111827";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const ACCENT = "#2563eb";

/** Wraps body HTML in a centered, max-width shell that survives Outlook. */
function shell(bodyHtml: string, footerHtml = ""): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f7f9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;">
<tr><td style="padding:32px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">
${bodyHtml}
</td></tr>
</table>
${
  footerHtml
    ? `<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
<tr><td style="padding:20px 32px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};text-align:center;">
${footerHtml}
</td></tr></table>`
    : ""
}
</td></tr>
</table>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="background:${ACCENT};border-radius:8px;">
<a href="${href}" style="display:inline-block;padding:12px 24px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${label}</a>
</td></tr></table>`;
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Owner notification. `replyTo` is the submitter, so hitting Reply in your mail
 * client goes straight to them rather than back to yourself.
 */
export function buildContactNotification(msg: ContactLike, to: string): OutgoingEmail {
  const subject = msg.subject || "Website Contact";
  const when = msg.createdAt.toISOString().replace("T", " ").slice(0, 16) + " UTC";

  const row = (label: string, value: string) =>
    `<tr>
<td style="padding:6px 0;font-family:${MONO};font-size:12px;color:${MUTED};width:80px;vertical-align:top;">${label}</td>
<td style="padding:6px 0;font-family:${FONT};font-size:14px;color:${INK};">${value}</td>
</tr>`;

  const html = shell(
    `<p style="margin:0 0 4px;font-family:${MONO};font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.05em;">New contact message</p>
<h1 style="margin:0 0 24px;font-size:20px;font-weight:700;color:${INK};">${escapeHtml(subject)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};margin-bottom:24px;">
${row("From", escapeHtml(msg.name))}
${row(
  "Email",
  `<a href="mailto:${encodeURI(msg.email)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(msg.email)}</a>`
)}
${row("Received", escapeHtml(when))}
</table>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.7;color:${INK};">${escapeHtml(msg.message)}</div>`,
    `Reply directly to this email to respond to ${escapeHtml(msg.name)}.<br>
<a href="${getSiteUrl()}/admin/messages" style="color:${MUTED};">View in admin</a>`
  );

  const text = `New contact message

Subject:  ${subject}
From:     ${msg.name}
Email:    ${msg.email}
Received: ${when}

${msg.message}

---
Reply directly to this email to respond.
${getSiteUrl()}/admin/messages`;

  return {
    to,
    subject: `[Portfolio] ${subject} — ${msg.name}`,
    html,
    text,
    replyTo: msg.email,
  };
}

/** Acknowledgement to the person who wrote in. */
export function buildContactAck(msg: ContactLike): OutgoingEmail {
  const site = getSiteUrl();
  const firstName = msg.name.trim().split(/\s+/)[0] || "there";

  const html = shell(
    `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${INK};">Thanks for reaching out, ${escapeHtml(firstName)}.</h1>
<p style="margin:0 0 16px;">Your message landed safely — I read everything myself and usually reply within a day or two.</p>
<p style="margin:0 0 8px;font-family:${MONO};font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.05em;">What you sent</p>
<div style="padding:16px;background:#f9fafb;border:1px solid ${BORDER};border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:${MUTED};">${escapeHtml(msg.message)}</div>
<p style="margin:24px 0 0;">— Rauhan</p>`,
    `<a href="${site}" style="color:${MUTED};">${site.replace(/^https?:\/\//, "")}</a>`
  );

  const text = `Thanks for reaching out, ${firstName}.

Your message landed safely — I read everything myself and usually reply within a day or two.

What you sent:
${msg.message}

— Rauhan
${site}`;

  return {
    to: msg.email,
    subject: "Thanks for reaching out",
    html,
    text,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                  */
/* -------------------------------------------------------------------------- */

export function buildConfirmEmail(sub: SubscriberLike): OutgoingEmail {
  const site = getSiteUrl();
  const confirmUrl = `${site}/api/newsletter/confirm?token=${encodeURIComponent(sub.confirmToken)}`;

  const html = shell(
    `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${INK};">Confirm your subscription</h1>
<p style="margin:0 0 8px;">You asked to get my writing on backend reliability, ledgers, and distributed systems. One click and you are in.</p>
${button(confirmUrl, "Confirm subscription")}
<p style="margin:0;font-size:13px;color:${MUTED};">If that button does not work, paste this into your browser:<br>
<span style="font-family:${MONO};font-size:12px;word-break:break-all;">${escapeHtml(confirmUrl)}</span></p>`,
    `If you did not request this, just ignore this email — nothing will be sent to you.`
  );

  const text = `Confirm your subscription

You asked to get my writing on backend reliability, ledgers, and distributed systems.

Confirm here:
${confirmUrl}

If you did not request this, ignore this email — nothing will be sent to you.`;

  return { to: sub.email, subject: "Confirm your subscription", html, text };
}

/**
 * New-post announcement. Sends excerpt + link rather than full content: no
 * markdown renderer needed in the email path, and the goal is traffic to the post.
 */
export function buildNewsletterEmail(article: ArticleLike, sub: SubscriberLike): OutgoingEmail {
  const site = getSiteUrl();
  const postUrl = `${site}/writing/${article.slug}`;
  const unsubUrl = `${site}/newsletter/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;
  const oneClickUrl = `${site}/api/newsletter/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;

  const html = shell(
    `<p style="margin:0 0 4px;font-family:${MONO};font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.05em;">New post · ${escapeHtml(article.readingTime)}</p>
<h1 style="margin:0 0 16px;font-size:22px;font-weight:700;line-height:1.3;color:${INK};">${escapeHtml(article.title)}</h1>
<p style="margin:0;color:${MUTED};font-size:15px;line-height:1.7;">${escapeHtml(article.excerpt)}</p>
${button(postUrl, "Read the full essay &rarr;")}`,
    `You are getting this because you confirmed a subscription at ${site.replace(/^https?:\/\//, "")}.<br>
<a href="${unsubUrl}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a>`
  );

  const text = `New post · ${article.readingTime}

${article.title}

${article.excerpt}

Read it here:
${postUrl}

---
You are getting this because you confirmed a subscription at ${site.replace(/^https?:\/\//, "")}.
Unsubscribe: ${unsubUrl}`;

  return {
    to: sub.email,
    subject: article.title,
    html,
    text,
    from: process.env.NEWSLETTER_FROM || process.env.EMAIL_FROM,
    // RFC 8058. This is what makes Gmail/Yahoo render their native unsubscribe
    // button, which diverts "report spam" clicks into clean unsubscribes.
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
