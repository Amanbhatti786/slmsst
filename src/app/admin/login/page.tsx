"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setErrorMsg(error?.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    // Verify user exists in authorized admin_users table
    const { data: adminRecord, error: adminErr } = await supabase
      .from("admin_users")
      .select("id, is_active")
      .eq("id", data.user.id)
      .single();

    if (adminErr || !adminRecord || !adminRecord.is_active) {
      await supabase.auth.signOut();
      setErrorMsg("Access Denied: Your account is not authorized as an active school administrator.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0B2545] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-[#C59B27]">
        <div className="p-8 text-center bg-slate-50 border-b border-slate-200">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#0B2545] text-[#C59B27] flex items-center justify-center mb-3 shadow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-xl font-bold text-[#0B2545]">
            Official Admin Portal
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Shah Latif Model Secondary School Thikratho (Code: 340102001)
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@slmsst.edu.pk"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#134074]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#134074]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2545] hover:bg-[#134074] text-white font-bold py-3 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B2545]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public School Website</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
      }

