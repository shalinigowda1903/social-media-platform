import { NextResponse } from "next/server";

const campaigns = [
  {
    id: 1,
    user_id: 1,
    name: "Product Launch 2.0",
    description: "Cross-platform launch campaign for SocialPilot AI Co-Pilot features and multi-network calendar.",
    platforms: "instagram,facebook,linkedin",
    start_date: "2026-09-01",
    end_date: "2026-09-15",
    budget: 12500,
    objective: "Increase Product Awareness & Signups",
    status: "Active",
    progress_percent: 78,
    target_reach: 150000,
    actual_reach: 125000,
    target_engagement: 40000,
    actual_engagement: 32000,
    posts_count: 24,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 1,
    name: "Q3 Thought Leadership",
    description: "Weekly executive insights and AI industry frameworks on LinkedIn and Twitter.",
    platforms: "linkedin,twitter",
    start_date: "2026-08-20",
    end_date: "2026-09-20",
    budget: 8000,
    objective: "Drive B2B Inbound Leads",
    status: "Active",
    progress_percent: 62,
    target_reach: 100000,
    actual_reach: 84000,
    target_engagement: 25000,
    actual_engagement: 19400,
    posts_count: 16,
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newCampaign = {
      id: Date.now(),
      user_id: 1,
      name: body.name || "New Campaign",
      description: body.description || "",
      platforms: body.platforms || "instagram,facebook",
      start_date: body.start_date || "2026-09-01",
      end_date: body.end_date || "2026-09-30",
      budget: body.budget || 5000,
      objective: body.objective || "Brand Awareness",
      status: "Active",
      progress_percent: 0,
      target_reach: body.target_reach || 50000,
      actual_reach: 0,
      target_engagement: body.target_engagement || 10000,
      actual_engagement: 0,
      posts_count: 0,
      created_at: new Date().toISOString()
    };
    return NextResponse.json(newCampaign, { status: 201 });
  } catch {
    return NextResponse.json({ detail: "Failed to create campaign" }, { status: 500 });
  }
}
