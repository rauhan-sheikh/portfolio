"use client";

import React from "react";
import Image from "next/image";
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
    <div
      className={`logo-avatar relative shrink-0 ${iconClass} ${className} group`}
      aria-hidden="true"
    >
      <Image
        src="/avatar-tile.png"
        alt=""
        width={128}
        height={128}
        unoptimized
        className="logo-avatar-img absolute inset-0 h-full w-full"
      />
      <Image
        src="/avatar-tile-blink.png"
        alt=""
        width={128}
        height={128}
        unoptimized
        className="logo-avatar-img logo-avatar-blink absolute inset-0 h-full w-full"
      />
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
