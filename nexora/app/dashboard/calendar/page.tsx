"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Trash2,
  Send,
  Sparkles,
  X,
  Filter,
  Eye,
  Layers
} from "lucide-react";
import { postsApi, PostItem } from "@/lib/api";
import { getPlatformBadgeColor, getStatusBadgeColor } from "@/lib/utils";

export default function CalendarPage() {
  const [currentMonthName, setCurrentMonthName] = useState("September 2026");
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // Selected Day / Week offset
  const [selectedDayNum, setSelectedDayNum] = useState<number>(2); // Default Sep 2

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postsApi.list({ status: selectedStatus, platform: selectedPlatform });
      setPosts(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedStatus, selectedPlatform]);

  const daysInMonth = 30; // September 2026
  const startingDayOffset = 2; // Starts Tuesday

  const handlePublishNow = async (post: PostItem) => {
    try {
      await postsApi.publishNow(post.id);
      fetchPosts();
      setSelectedPost(null);
    } catch {
      setPosts((prev) =>
        prev.map((item) => (item.id === post.id ? { ...item, status: "Published" } : item))
      );
      setSelectedPost(null);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await postsApi.delete(id);
      fetchPosts();
      setSelectedPost(null);
    } catch {
      setPosts((prev) => prev.filter((item) => item.id !== id));
      setSelectedPost(null);
    }
  };

  // Helper to extract day number from scheduled_at / published_at / id
  const getPostDayNumber = (post: PostItem): number => {
    if (post.scheduled_at) {
      const d = new Date(post.scheduled_at);
      if (!isNaN(d.getDate())) return d.getDate();
    }
    if (post.published_at) {
      const d = new Date(post.published_at);
      if (!isNaN(d.getDate())) return d.getDate();
    }
    // Fallback based on ID modulo days
    return (post.id % 28) + 1;
  };

  const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:30 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-[#635BFF]" />
            Content Calendar
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Multi-network content scheduler with Month, Week, and Day execution views.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month / Week / Day Switcher */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                  viewMode === mode
                    ? "bg-[#635BFF] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/create-post"
            className="inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#635BFF]/25 hover:bg-[#5046E5] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* 2. Filters & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Month Picker */}
        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-base font-extrabold text-slate-900 min-w-[140px] text-center">
            {currentMonthName}
          </span>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#635BFF] focus:outline-none"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">X (Twitter)</option>
            <option value="youtube">YouTube</option>
            <option value="pinterest">Pinterest</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#635BFF] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="failed">Failed</option>
          </select>
        </div>

      </div>

      {/* 3. CALENDAR VIEW MODES */}

      {/* VIEW 1: MONTH VIEW */}
      {viewMode === "month" && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-bold text-slate-600 py-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[600px]">
            {Array.from({ length: startingDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/30 p-2 text-slate-300 text-xs min-h-[110px]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 2; // Sep 2
              const dayPosts = posts.filter((p) => getPostDayNumber(p) === dayNum);

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDayNum(dayNum)}
                  className={`p-2 min-h-[110px] flex flex-col justify-between transition-colors hover:bg-slate-50/60 group relative ${
                    isToday ? "bg-indigo-50/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday
                          ? "bg-[#635BFF] text-white shadow-xs"
                          : "text-slate-700 group-hover:text-slate-900"
                      }`}
                    >
                      {dayNum}
                    </span>

                    <Link
                      href={`/dashboard/create-post?day=${dayNum}`}
                      className="opacity-0 group-hover:opacity-100 flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-500 hover:bg-[#635BFF] hover:text-white transition-all text-xs"
                      title="Schedule post on this day"
                    >
                      +
                    </Link>
                  </div>

                  <div className="mt-1.5 space-y-1.5 flex-1">
                    {dayPosts.map((p) => {
                      const statusBadge = getStatusBadgeColor(p.status);
                      return (
                        <div
                          key={p.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(p);
                          }}
                          className={`cursor-pointer rounded-lg p-1.5 text-[10px] border shadow-2xs transition-all hover:scale-[1.02] ${
                            p.status === "Published"
                              ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
                              : p.status === "Scheduled"
                              ? "bg-indigo-50/90 border-indigo-200 text-indigo-950"
                              : "bg-slate-100 border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5 opacity-70" />
                              {p.scheduled_at ? new Date(p.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10:30 AM"}
                            </span>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                          </div>
                          <p className="truncate font-medium mt-0.5">{p.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: WEEK VIEW */}
      {viewMode === "week" && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-bold text-slate-700 py-3">
            <div className="border-r border-slate-200 text-slate-400">Time</div>
            {["Sun (Aug 31)", "Mon (Sep 1)", "Tue (Sep 2)", "Wed (Sep 3)", "Thu (Sep 4)", "Fri (Sep 5)", "Sat (Sep 6)"].map((dayStr, idx) => (
              <div key={dayStr} className={idx === 2 ? "text-[#635BFF]" : ""}>
                {dayStr}
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="divide-y divide-slate-100 min-h-[500px]">
            {timeSlots.map((slot) => (
              <div key={slot} className="grid grid-cols-8 divide-x divide-slate-100 min-h-[70px]">
                <div className="p-2 text-[11px] font-bold text-slate-400 bg-slate-50/30 flex items-center justify-center">
                  {slot}
                </div>
                {Array.from({ length: 7 }).map((_, colIdx) => {
                  const dayNum = colIdx; // 0 to 6
                  const matchingPosts = posts.filter((p) => getPostDayNumber(p) === dayNum);
                  return (
                    <div key={colIdx} className="p-1.5 hover:bg-slate-50/50 relative group">
                      {matchingPosts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPost(p)}
                          className="cursor-pointer rounded-lg bg-indigo-50 border border-indigo-200 p-1.5 text-[10px] font-semibold text-indigo-950 shadow-2xs mb-1"
                        >
                          <span className="font-bold block text-[9px] text-[#635BFF]">{p.status}</span>
                          <p className="line-clamp-2">{p.content}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DAY VIEW */}
      {viewMode === "day" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Detailed Timeline Schedule — September {selectedDayNum}, 2026
              </h3>
              <p className="text-xs text-slate-500">Hourly breakdown of scheduled and published executions</p>
            </div>
            <Link
              href={`/dashboard/create-post?day=${selectedDayNum}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#635BFF] px-3.5 py-2 text-xs font-bold text-white shadow-xs"
            >
              + Add Post for Day {selectedDayNum}
            </Link>
          </div>

          <div className="space-y-4">
            {timeSlots.map((slot) => {
              const dayPosts = posts.filter((p) => getPostDayNumber(p) === selectedDayNum);
              return (
                <div key={slot} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/40">
                  <div className="w-20 shrink-0 text-xs font-extrabold text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#635BFF]" />
                    {slot}
                  </div>
                  <div className="flex-1 space-y-2">
                    {dayPosts.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No posts scheduled for this window.</span>
                    ) : (
                      dayPosts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPost(p)}
                          className="cursor-pointer rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs hover:border-[#635BFF] transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadgeColor(p.status).bg}`}>
                              {p.status}
                            </span>
                            <div className="flex items-center gap-1">
                              {p.platforms.split(",").map((plat) => (
                                <span key={plat} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-700">
                                  {plat.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">{p.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeColor(selectedPost.status).bg}`}>
                  {selectedPost.status}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Post ID #{selectedPost.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {selectedPost.content}
            </div>

            {selectedPost.media_url && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                <img src={selectedPost.media_url} alt="Media" className="h-full w-full object-cover" />
              </div>
            )}

            {/* Target Networks */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Target Networks</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedPost.platforms.split(",").map((plat) => {
                  const p = plat.trim();
                  const style = getPlatformBadgeColor(p);
                  return (
                    <span
                      key={p}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold border capitalize ${style.bg} ${style.text} ${style.border}`}
                    >
                      {p}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDeletePost(selectedPost.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Delete Post
              </button>

              <div className="flex items-center gap-2">
                {selectedPost.status !== "Published" && (
                  <button
                    onClick={() => handlePublishNow(selectedPost)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" /> Publish Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
