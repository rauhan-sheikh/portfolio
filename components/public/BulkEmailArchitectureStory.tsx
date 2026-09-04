"use client";

import React, { useState } from "react";
import { ArrowRight, AlertTriangle, CheckCircle2, Play, RefreshCw, Cpu, Server, Laptop, Database, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BulkEmailArchitectureStory() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  const [simulating, setSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "failed" | "success">("idle");

  const runSimulation = () => {
    setSimulating(true);
    setProgress(0);
    setStatus("running");

    if (activeTab === "before") {
      // Simulate failure at ~32%
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 32) {
            clearInterval(interval);
            setStatus("failed");
            setSimulating(false);
            return 32;
          }
          return prev + 4;
        });
      }, 70);
    } else {
      // Simulate smooth queue completion
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("success");
            setSimulating(false);
            return 100;
          }
          return prev + 10;
        });
      }, 80);
    }
  };

  const resetSimulation = () => {
    setProgress(0);
    setStatus("idle");
    setSimulating(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono mb-2">
            <Cpu className="h-3.5 w-3.5" />
            <span>Architecture Transformation · Background Queues</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary tracking-tight">
            Why I Moved Bulk Email to BullMQ
          </h3>
          <p className="text-sm text-secondary mt-1 max-w-xl">
            The problem wasn&apos;t sending emails. The problem was where the work lived. Transitioning from client-tied loops to resilient Redis background workers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab("before");
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "before"
                ? "bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/30"
                : "text-secondary hover:text-primary"
            }`}
          >
            Before (Browser Loop)
          </button>
          <button
            onClick={() => {
              setActiveTab("after");
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "after"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                : "text-secondary hover:text-primary"
            }`}
          >
            After (BullMQ Queue)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Architecture Diagram */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border border-border bg-background space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 text-[11px] text-secondary">
              <span>SYSTEM TOPOLOGY</span>
              <span className={activeTab === "before" ? "text-red-500" : "text-emerald-500"}>
                {activeTab === "before" ? "// FRAGILE CLIENT-DEPENDENT" : "// DECOUPLED ASYNC WORKERS"}
              </span>
            </div>

            {activeTab === "before" ? (
              <div className="space-y-3 py-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-red-500" />
                    <span className="text-primary font-bold">Browser Client</span>
                  </div>
                  <span className="text-red-500">Executes for-loop for 1,500 rows</span>
                </div>
                <div className="text-center text-secondary text-xs">↓ Sequential HTTP requests</div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-secondary" />
                    <span className="text-primary">API Endpoint</span>
                  </div>
                  <span className="text-secondary">Direct SMTP invoke</span>
                </div>
                <div className="text-center text-secondary text-xs">↓ Dependent on browser tab remaining open</div>
                <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-[11px] leading-relaxed">
                  ⚠️ If coordinator shuts laptop at row 480: process dies, state is lost, resending triggers duplicate emails.
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-secondary" />
                    <span className="text-primary font-bold">Browser Client</span>
                  </div>
                  <span className="text-emerald-500">Single batch POST (40ms response)</span>
                </div>
                <div className="text-center text-secondary text-xs">↓ Enqueues batch atomically</div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-indigo-500" />
                    <span className="text-primary font-bold">Redis + BullMQ</span>
                  </div>
                  <span className="text-indigo-500">Persistent Job Queue</span>
                </div>
                <div className="text-center text-secondary text-xs">↓ Workers consume in parallel with retry jitter</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <span className="text-emerald-500 font-bold block">Worker 01</span>
                    <span className="text-[10px] text-secondary">50 concurrent</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <span className="text-emerald-500 font-bold block">Worker 02</span>
                    <span className="text-[10px] text-secondary">Exponential retry</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm leading-relaxed text-secondary">
            {activeTab === "before"
              ? "Every campaign forced the employee to babysit their browser. A network hiccup, laptop sleep mode, or single timeout permanently halted the dispatch."
              : "Decoupled architecture: The client gets an instant 202 Accepted response. Workers process jobs independently, back off on rate limits, and record progress in PostgreSQL."}
          </p>
        </div>

        {/* Interactive Simulation Sandbox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-inner font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
                Interactive Simulator
              </span>
              <span className="text-xs text-accent">1,500 Emails Batch</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-secondary">
                <span>Dispatch Progress</span>
                <span className="font-bold text-primary">{Math.round((progress / 100) * 1500)} / 1,500</span>
              </div>
              <div className="h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${
                    status === "failed"
                      ? "bg-red-500"
                      : status === "success"
                      ? "bg-emerald-500"
                      : "bg-accent"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Status Alert Box */}
            <div className="min-h-[72px] flex items-center">
              {status === "idle" && (
                <p className="text-xs text-secondary">
                  Click &ldquo;Simulate Dispatch&rdquo; to test how this architecture handles real-world batch workloads.
                </p>
              )}
              {status === "running" && (
                <div className="flex items-center gap-2 text-xs text-accent animate-pulse">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing campaign records...</span>
                </div>
              )}
              {status === "failed" && (
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>CLIENT DISCONNECT AT #480!</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Browser suspended. 1,020 emails failed. Resending will cause duplicate deliveries.
                  </p>
                </div>
              )}
              {status === "success" && (
                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>1,500 EMAILS DELIVERED</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Workers completed jobs autonomously in background. Zero duplicates, 100% accounted.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-background font-mono text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Simulate Dispatch</span>
              </button>
              <button
                onClick={resetSimulation}
                disabled={simulating}
                className="p-2 rounded-lg border border-border hover:bg-surface text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Reset simulation"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-secondary">
        <span>Failure rate dropped from ~30% to &lt;0.05%</span>
        <Link
          href="/writing/bulk-email-bullmq-architecture"
          className="text-accent hover:underline flex items-center gap-1 font-semibold"
        >
          Read Technical Essay <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
