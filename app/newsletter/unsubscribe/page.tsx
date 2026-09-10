import React from "react";
import Link from "next/link";
import { MailMinus } from "lucide-react";
import UnsubscribeButton from "@/components/public/UnsubscribeButton";

export const metadata = {
  title: "Unsubscribe — Rauhan Sheikh",
  robots: { index: false, follow: false },
};

/**
 * Renders only. The actual unsubscribe happens on an explicit button press,
 * which POSTs — see components/public/UnsubscribeButton.tsx for why.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6 font-body">
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-surface">
          <MailMinus className="w-7 h-7 text-secondary" strokeWidth={1.5} />
        </div>

        {token ? (
          <>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
                Unsubscribe from the list?
              </h1>
              <p className="text-base text-secondary leading-relaxed">
                You&apos;ll stop receiving new-post emails. Nothing else changes, and you can
                resubscribe any time from the footer.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 pt-2">
              <UnsubscribeButton token={token} />
              <Link href="/writing" className="text-xs text-secondary hover:text-primary font-mono transition-colors">
                Never mind, keep me subscribed
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-primary tracking-tight">
                Missing unsubscribe link.
              </h1>
              <p className="text-base text-secondary leading-relaxed">
                This page needs the token from your email. Open the unsubscribe link at
                the bottom of any newsletter, or reply to one and I&apos;ll remove you
                manually.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:border-accent/50 text-secondary text-sm font-medium transition-colors"
            >
              Back home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
