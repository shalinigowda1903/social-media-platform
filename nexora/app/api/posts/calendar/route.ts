import { NextResponse } from "next/server";

export async function GET() {
  const calendarPosts = [
    {
      id: 1,
      content: "🚀 Excited to announce SocialPilot 2.0! Schedule across 6 platforms simultaneously.",
      platforms: ["instagram", "facebook", "linkedin", "twitter"],
      status: "Published",
      scheduled_at: null,
      published_at: "2026-09-01T10:30:00Z",
      media_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      content: "Behind the scenes: How our marketing team plans 30 days of content in under 2 hours.",
      platforms: ["instagram", "facebook", "linkedin", "twitter"],
      status: "Scheduled",
      scheduled_at: "2026-09-02T14:30:00Z",
      published_at: null,
      media_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      content: "Why data-backed scheduling outperforms manual posting every single time.",
      platforms: ["linkedin", "twitter"],
      status: "Scheduled",
      scheduled_at: "2026-09-04T09:00:00Z",
      published_at: null,
      media_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80"
    }
  ];

  return NextResponse.json(calendarPosts);
}
