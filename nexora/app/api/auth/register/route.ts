import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { detail: "Please provide all required fields (name, email, password)." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { detail: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    const response = {
      access_token: `sp_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      token_type: "bearer",
      user_id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      role: role || "Admin",
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch {
    return NextResponse.json(
      { detail: "An error occurred while creating your account. Please try again." },
      { status: 500 }
    );
  }
}
