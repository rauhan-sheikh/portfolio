import React from "react";
import { db } from "@/lib/db";
import { Mail, MapPin, Shield, Clock } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/public/Icons";
import ContactForm from "@/components/public/ContactForm";

export const metadata = {
  title: "Contact — Rauhan Sheikh",
  description: "Get in touch with Rauhan Sheikh for engineering opportunities, backend architecture, or consulting.",
};

export const revalidate = 0;

export default async function ContactPage() {
  const settingsList = await db.siteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 font-body">
      {/* Header */}
      <div className="space-y-4 max-w-2xl border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 text-secondary text-xs font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{settings.availability_badge || "Open to interesting backend & full-stack opportunities"}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary tracking-tight">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          Whether you have an interesting engineering problem, an architectural challenge, or a role to discuss, feel free to reach out directly or use the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-surface/50 space-y-4 font-mono text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent">
              Direct Channels
            </h2>

            <div className="space-y-3">
              <a
                href={`mailto:${settings.email || "hello@rauhansheikh.com"}`}
                className="flex items-center gap-2.5 text-primary hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-secondary" />
                <span className="truncate">{settings.email || "hello@rauhansheikh.com"}</span>
              </a>

              {settings.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-secondary hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Profile</span>
                </a>
              )}

              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-secondary hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn Profile</span>
                </a>
              )}

              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-secondary hover:text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span>X / Twitter</span>
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-border/60 text-secondary space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Based in {settings.location || "India"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Response turnaround: ~24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl border border-border bg-surface/50 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold font-heading text-primary">
            Send an Inquiry
          </h2>
          <p className="text-xs text-secondary leading-relaxed font-mono">
            Messages are saved here and emailed straight to my inbox.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
