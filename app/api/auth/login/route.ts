import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";
import { checkLoginRateLimit } from "@/lib/rate-limit";

/**
 * Records a failed attempt. Both the unknown-email and bad-password branches
 * write this, so the rate limiter cannot be sidestepped by guessing addresses,
 * and the audit log finally shows attacks rather than only successes.
 */
async function recordFailure(email: string, reason: string) {
  await db.auditLog.create({
    data: {
      action: "ADMIN_LOGIN_FAILED",
      entityType: "AUTH",
      details: `Failed login attempt for ${email} (${reason})`,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const limit = await checkLoginRateLimit(normalizedEmail);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const user = await db.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      await recordFailure(normalizedEmail, "unknown email");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      await recordFailure(normalizedEmail, "bad password");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Record audit log
    await db.auditLog.create({
      data: {
        action: "ADMIN_LOGIN",
        entityType: "AUTH",
        entityId: user.id,
        details: `Admin logged in from email: ${user.email}`,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server authentication error" },
      { status: 500 }
    );
  }
}
