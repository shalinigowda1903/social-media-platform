import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Please provide both email and password." },
        { status: 400 }
      );
    }

    // Determine user details based on email
    const trimmedEmail = String(email).trim().toLowerCase();
    const displayName = trimmedEmail.includes("@")
      ? trimmedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "SocialPilot User";

    const response = {
      access_token: `sp_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      token_type: "bearer",
      user_id: 1,
      name: trimmedEmail === "admin@intellipost.com" || trimmedEmail === "admin@socialpilot.com" ? "Chandu Verma" : displayName,
      email: trimmedEmail,
      role: "Admin",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { detail: "An error occurred while logging in. Please try again." },
      { status: 500 }
    );
  }
}
