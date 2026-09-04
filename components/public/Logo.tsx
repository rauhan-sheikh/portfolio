"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
  textClassName?: string;
  badgeOnly?: boolean;
}

export default function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
  textClassName = "",
  badgeOnly = false,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: "h-6 w-6", text: "text-sm", dim: 24 },
    md: { icon: "h-8 w-8", text: "text-base", dim: 32 },
    lg: { icon: "h-10 w-10", text: "text-lg", dim: 40 },
    xl: { icon: "h-12 w-12", text: "text-xl", dim: 48 },
  };

  const { icon: iconClass, text: textClass } = sizeMap[size];

  const Mark = (
    <div className={`relative shrink-0 ${iconClass} ${className} flex items-center justify-center group`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform duration-200"
      >
        <defs>
          <linearGradient id="logo-rs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="logo-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Outer squircle plate */}
        <rect width="100" height="100" rx="24" className="fill-slate-900 dark:fill-slate-950" />
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="22"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-800 dark:text-slate-800/80"
        />

        {/* Blueprint grid lines */}
        <path
          d="M15 50H85 M50 15V85"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="text-slate-700/30 dark:text-slate-700/40"
        />

        {/* Geometric R / S Monogram */}
        <path
          d="M26 24H54C64 24 72 32 72 41.5C72 50 66 57 58 59L74 78H59L46 62H38V78H26V24Z"
          fill="url(#logo-rs-grad)"
        />

        {/* Cutout window */}
        <path
          d="M38 34V52H52C57.5 52 61 47.5 61 42.5C61 37.5 57.5 34 52 34H38Z"
          className="fill-slate-900 dark:fill-slate-950"
        />

        {/* Kinetic slash */}
        <path d="M48 56L67 78H55L38 56H48Z" fill="url(#logo-accent-grad)" />

        {/* Data accent points */}
        <circle cx="26" cy="24" r="3.5" fill="#67E8F9" />
        <circle cx="74" cy="78" r="4" fill="#38BDF8" />
        <circle cx="52" cy="42.5" r="3" fill="#38BDF8" />
      </svg>
    </div>
  );

  if (badgeOnly || !showText) {
    if (href) {
      return <Link href={href} aria-label="Rauhan Sheikh">{Mark}</Link>;
    }
    return Mark;
  }

  const Content = (
    <div className="flex items-center gap-2.5 font-heading select-none group">
      {Mark}
      <span className={`font-bold tracking-tight text-primary transition-colors group-hover:text-accent ${textClass} ${textClassName}`}>
        rauhan<span className="text-accent">.</span>sheikh
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{Content}</Link>;
  }

  return Content;
}
