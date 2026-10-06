"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, Sparkles, Check, Lock, Mail } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fillDemo = () => {
    setEmail("admin@socialpilot.com");
    setPassword("password123");
    setError("");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      await authApi.login(email.trim(), password);
      setSuccess("Login successful! Redirecting to SocialPilot workspace...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#7C3AED] text-white shadow-lg shadow-[#635BFF]/30">
              <Layers className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                SocialPilot
                <span className="rounded bg-[#635BFF]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#635BFF]">
                  AI
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 block -mt-1">
                Plan. Post. Perform.
              </span>
            </div>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-xs text-slate-500">Log in to manage your intelligent social workspace</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          
          {/* 1-Click Demo Login Banner */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50 p-3.5 border border-indigo-100/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#635BFF]" />
                Demo Credentials
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">admin@socialpilot.com / password123</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#635BFF] shadow-xs border border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              Fill Demo
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@socialpilot.com"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-[#635BFF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] font-semibold text-[#635BFF] hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-[#635BFF] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#7C3AED] py-3 text-sm font-semibold text-white shadow-md shadow-[#635BFF]/25 hover:from-[#5046E5] hover:to-[#6D28D9] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Log In to Workspace"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-[#635BFF] hover:underline">
              Create free account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
