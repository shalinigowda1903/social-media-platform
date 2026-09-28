import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { topic = "Social Media Growth", tone = "Engaging" } = body;

    const trimmedTopic = String(topic).trim() || "Social Media Strategy";

    const cleanTag = trimmedTopic
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 15);

    const hashtags = [
      `#${cleanTag}`,
      "#SocialPilot",
      "#ContentStrategy",
      "#MarketingGrowth",
      "#CreatorEconomy",
      "#DigitalMarketing",
      "#SocialMediaTips",
      "#Innovation"
    ];

    const response = {
      primary_caption: `🚀 Elevate your brand with smart execution on ${trimmedTopic}! Consistency and strategic delivery are what transform occasional viewers into loyal community advocates.\n\n👇 What is your biggest challenge with ${trimmedTopic}? Drop your thoughts below!`,
      hashtags,
      call_to_action: "💬 Drop a comment below with your perspective, and bookmark this post for your next campaign planning session!",
      best_time_to_post: "Tuesday & Thursday at 10:30 AM (Peak Engagement Window)",
      recommended_days: ["Tuesday", "Thursday", "Saturday"],
      adaptations: {
        instagram: `✨ Scaling your presence through ${trimmedTopic} requires consistency, authenticity, and visual storytelling.\n\n💡 Save this post for your next content batching day!\n\n${hashtags.slice(0, 6).join(" ")}`,
        linkedin: `In modern business landscapes, mastering ${trimmedTopic} is no longer optional—it is a competitive advantage.\n\nKey takeaways for marketing leaders:\n1. Lead with clear value proposition\n2. Maintain consistent scheduling cadence\n3. Leverage data insights to refine content output\n\nHow is your organization approaching ${trimmedTopic} this quarter?`,
        twitter: `The secret to winning with ${trimmedTopic} isn't doing more—it's executing with laser precision. 🎯\n\nDouble tap if you're focusing on this this week! 🧵 👇`,
        facebook: `Hey community! 👋 We just published our key insights on ${trimmedTopic}. Whether you're just starting or scaling up, these foundational principles will help you reach more people consistently. Check out the link in comments!`,
        youtube: `Complete Masterclass Guide to ${trimmedTopic} | Step-by-Step Tutorial and Frameworks`,
        pinterest: `${trimmedTopic} Roadmap & Strategy Checklist for Modern Content Creators`
      }
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { detail: "Failed to generate AI content." },
      { status: 500 }
    );
  }
}
