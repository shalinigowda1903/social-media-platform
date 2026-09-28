import { NextResponse } from "next/server";

export async function GET() {
  const overview = {
    total_reach: 148500,
    total_reach_growth: "+18.4%",
    total_engagement: 38420,
    total_engagement_growth: "+24.1%",
    total_impressions: 237600,
    total_impressions_growth: "+15.8%",
    total_clicks: 12940,
    total_clicks_growth: "+31.2%",
    total_followers: 47170,
    total_followers_growth: "+12.6%",
    engagement_rate_avg: 4.85,
    posts_scheduled: 24,
    posts_published: 12,
    active_campaigns: 8
  };

  return NextResponse.json(overview);
}
