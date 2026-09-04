"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Layers, Calendar, Video, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TeamsArchitectureStory() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"pipeline" | "comparison">("pipeline");

  const steps = [
    {
      step: 1,
      title: "POST /me/events (Calendar)",
      badge: "Calendar Visibility",
      desc: "Dispatches calendar event creation with `isOnlineMeeting: true`. This guarantees the class immediately appears on the instructor's personal Outlook calendar.",
      code: `POST /v1.0/me/events
{
  "subject": "Distributed Systems Lecture #04",
  "isOnlineMeeting": true,
  "onlineMeetingProvider": "teamsForBusiness"
}`,
      caveat: "Problem: Graph API event response does NOT allow setting granular meeting policies like lobby bypass or auto-record.",
    },
    {
      step: 2,
      title: "Intercept & Parse joinWebUrl",
      badge: "Coordinate Parsing",
      desc: "Intercepts the generated meeting link from the calendar event response and decodes the base64-encoded thread conversation coordinates.",
      code: `// Response yields joinWebUrl
const joinUrl = event.onlineMeeting.joinUrl;
const threadId = decodeURIComponent(
  joinUrl.match(/thread\.v2\\/(.*?)\\//)[1]
);`,
      caveat: "Raw join URLs cannot be edited directly; we need the canonical onlineMeeting GUID.",
    },
    {
      step: 3,
      title: "Resolve Online Meeting GUID",
      badge: "ID Resolution",
      desc: "Queries the Graph onlineMeetings index using the thread ID filter to retrieve the true internal Microsoft Teams meeting identifier.",
      code: `GET /v1.0/me/onlineMeetings?$filter=
  joinMeetingIdSettings/joinMeetingId eq '\${threadId}'
// Returns meeting object with ID: "MSpkMTk...=="`,
      caveat: "Subject to Microsoft Graph 429 throttling; handled with exponential backoff & jitter.",
    },
    {
      step: 4,
      title: "PATCH /me/onlineMeetings/{id}",
      badge: "Security & Policy",
      desc: "Applies institutional academic policies: attendee mics muted by default, restricted screen sharing, automated cloud recording, and LMS lobby bypass.",
      code: `PATCH /v1.0/me/onlineMeetings/\${meetingId}
{
  "allowedPresenters": "roleIsPresenter",
  "isEntryExitAnnounced": false,
  "recordAutomatically": true,
  "lobbyBypassSettings": { "scope": "organization" }
}`,
      caveat: "Executed within 120ms before the user even receives their response.",
    },
    {
      step: 5,
      title: "Return Clean LMS Entity",
      badge: "Unified Response",
      desc: "Consolidates calendar event ID, meeting URL, and lecture tokens into a uniform entity stored in our PostgreSQL database.",
      code: `// 200 OK to Student & Faculty Portals
{
  "lectureId": "lec_9042",
  "joinUrl": "https://teams.microsoft.com/l/...",
  "calendarSynced": true,
  "recordingPolicy": "auto_record"
}`,
      caveat: "The instructor clicked a single button. All 4 API calls took < 450ms total.",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span>Signature Engineering Story · EdTech Scale</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary tracking-tight">
            Hiding Microsoft Graph Complexity
          </h3>
          <p className="text-sm text-secondary mt-1 max-w-xl">
            How a 5-step asynchronous resolution pipeline bridged the gap between Outlook calendar visibility and granular meeting security for 20,000+ students.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setViewMode("pipeline")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewMode === "pipeline"
                ? "bg-primary text-background font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            Backend Flow
          </button>
          <button
            onClick={() => setViewMode("comparison")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              viewMode === "comparison"
                ? "bg-primary text-background font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            The User vs System
          </button>
        </div>
      </div>

      {viewMode === "pipeline" ? (
        <div className="space-y-6">
          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  activeStep === idx
                    ? "border-accent bg-accent/10 text-accent font-semibold shadow-xs"
                    : "border-border/60 bg-background/50 hover:bg-surface text-secondary hover:text-primary"
                }`}
              >
                <div className="text-[10px] opacity-70">STEP 0{s.step}</div>
                <div className="truncate mt-0.5">{s.badge}</div>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-accent text-white text-xs font-mono flex items-center justify-center font-bold">
                  {steps[activeStep].step}
                </span>
                <h4 className="font-heading font-semibold text-base text-primary">
                  {steps[activeStep].title}
                </h4>
              </div>

              <p className="text-sm leading-relaxed text-secondary">
                {steps[activeStep].desc}
              </p>

              <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 text-xs leading-relaxed font-mono">
                <span className="font-bold">// THE CHALLENGE: </span>
                {steps[activeStep].caveat}
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-secondary">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Sub-second resolution</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  <span>Enforces RBAC policy</span>
                </div>
              </div>
            </div>

            {/* Code / Payload Snippet */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-background p-4 font-mono text-xs text-primary/90 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60 text-[11px] text-secondary">
                <span>payload.ts</span>
                <span className="text-accent">// Graph API Adapter</span>
              </div>
              <pre className="leading-relaxed">
                <code>{steps[activeStep].code}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* The User vs System Comparison */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-xl border border-border bg-background p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-secondary uppercase tracking-wider mb-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span>What the Instructor Sees</span>
              </div>
              <h4 className="font-heading font-bold text-lg text-primary">
                1 Click: &ldquo;Schedule Lecture&rdquo;
              </h4>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                The professor chooses a date, time, and class. Within half a second, the lecture is confirmed, an invitation appears on their phone&apos;s Outlook calendar, and students can see the session on the LMS.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface border border-border/80 font-mono text-xs space-y-2">
              <div className="flex justify-between text-secondary">
                <span>UI State:</span>
                <span className="text-emerald-500 font-semibold">Ready</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Required User Inputs:</span>
                <span className="text-primary font-bold">Subject, Time</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>API Complexity Exposed:</span>
                <span className="text-emerald-500 font-semibold">Zero</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/40 bg-accent/5 p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <Lock className="h-4 w-4" />
                <span>What the Backend Handles Invisibly</span>
              </div>
              <h4 className="font-heading font-bold text-lg text-primary">
                Multi-Step API Orchestrator
              </h4>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                The backend initiates calendar events, intercepts join URLs, resolves opaque online meeting IDs, patches microphone/screen-share lockdown policies, and caches credentials in Redis.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface/90 border border-border/80 font-mono text-xs space-y-2">
              <div className="flex justify-between text-secondary">
                <span>Graph API Calls:</span>
                <span className="text-accent font-bold">4 Requests</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Rate-Limit Safety:</span>
                <span className="text-accent font-semibold">Jitter Backoff</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Security Enforced:</span>
                <span className="text-accent font-semibold">Cloud Auto-Record</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-secondary">
        <span>Philosophy: Hide system complexity behind clean UX.</span>
        <Link
          href="/work/microsoft-teams-engine"
          className="text-accent hover:underline flex items-center gap-1 font-semibold"
        >
          Read Full Case Study <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
