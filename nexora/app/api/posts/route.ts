import { NextResponse } from "next/server";

const initialPosts = [
  {
    id: 1,
    user_id: 1,
    content: "Behind the scenes: How our marketing team plans 30 days of social content in 2 hours.",
    platforms: "instagram,facebook,linkedin,twitter",
    media_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
    media_type: "image",
    status: "Scheduled",
    scheduled_at: "2026-09-29T14:30:00Z",
    published_at: null,
    likes_count: 142,
    comments_count: 28,
    shares_count: 14,
    clicks_count: 85,
    reach_count: 4200,
    is_ai_generated: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 1,
    content: "Why data-backed scheduling outperforms manual posting every single time.",
    platforms: "linkedin,twitter",
    media_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    media_type: "image",
    status: "Scheduled",
    scheduled_at: "2026-09-30T09:00:00Z",
    published_at: null,
    likes_count: 210,
    comments_count: 45,
    shares_count: 32,
    clicks_count: 140,
    reach_count: 6800,
    is_ai_generated: false,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    user_id: 1,
    content: "Excited to announce SocialPilot 2.0! Schedule across 6 platforms simultaneously with AI...",
    platforms: "instagram,facebook,linkedin,twitter",
    media_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80",
    media_type: "image",
    status: "Published",
    scheduled_at: null,
    published_at: "2026-09-27T10:30:00Z",
    likes_count: 480,
    comments_count: 89,
    shares_count: 67,
    clicks_count: 320,
    reach_count: 18400,
    is_ai_generated: true,
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json(initialPosts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newPost = {
      id: Date.now(),
      user_id: 1,
      content: body.content || "New SocialPilot post",
      platforms: body.platforms || "instagram,facebook",
      media_url: body.media_url || null,
      media_type: body.media_type || "image",
      status: body.status || "Scheduled",
      scheduled_at: body.scheduled_at || new Date().toISOString(),
      published_at: body.status === "Published" ? new Date().toISOString() : null,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      clicks_count: 0,
      reach_count: 0,
      is_ai_generated: !!body.is_ai_generated,
      created_at: new Date().toISOString(),
      instagram_content: body.instagram_content,
      linkedin_content: body.linkedin_content,
      twitter_content: body.twitter_content,
      facebook_content: body.facebook_content
    };

    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json({ detail: "Failed to create post" }, { status: 500 });
  }
}
