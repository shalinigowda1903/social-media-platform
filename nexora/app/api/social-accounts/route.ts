import { NextResponse } from "next/server";

const accounts = [
  {
    id: 1,
    platform: "facebook",
    account_name: "Facebook Brand Page",
    account_handle: "@SocialPilotHQ",
    avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    followers_count: 12540,
    following_count: 320,
    growth_rate: "+12%",
    is_connected: true,
    token_status: "Valid",
    connected_at: "2026-08-01T00:00:00Z",
    last_synced_at: "Just now"
  },
  {
    id: 2,
    platform: "instagram",
    account_name: "Instagram Professional",
    account_handle: "@socialpilot_app",
    avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    followers_count: 8320,
    following_count: 450,
    growth_rate: "+15%",
    is_connected: true,
    token_status: "Valid",
    connected_at: "2026-08-01T00:00:00Z",
    last_synced_at: "Just now"
  },
  {
    id: 3,
    platform: "linkedin",
    account_name: "LinkedIn Company HQ",
    account_handle: "socialpilot-inc",
    avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    followers_count: 4210,
    following_count: 180,
    growth_rate: "+6%",
    is_connected: true,
    token_status: "Valid",
    connected_at: "2026-08-01T00:00:00Z",
    last_synced_at: "Just now"
  }
];

export async function GET() {
  return NextResponse.json(accounts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newAccount = {
      id: Date.now(),
      platform: body.platform || "instagram",
      account_name: body.account_name || `${body.platform} Account`,
      account_handle: body.account_handle || `@${body.platform}_user`,
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      followers_count: Math.floor(Math.random() * 5000) + 1000,
      following_count: 200,
      growth_rate: "+10%",
      is_connected: true,
      token_status: "Valid",
      connected_at: new Date().toISOString(),
      last_synced_at: "Just now"
    };
    return NextResponse.json(newAccount, { status: 201 });
  } catch {
    return NextResponse.json({ detail: "Failed to connect account" }, { status: 500 });
  }
}
