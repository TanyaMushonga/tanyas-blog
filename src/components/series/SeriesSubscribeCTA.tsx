"use client";

import React, { useState } from "react";
import { subscribe } from "@/actions/subscribe";
import { BellRing, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeriesSubscribeCTAProps {
  seriesName?: string;
  className?: string;
}

export default function SeriesSubscribeCTA({
  seriesName,
  className,
}: SeriesSubscribeCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus("loading");
      const resMessage = await subscribe(email);
      setMessage(resMessage);
      setStatus("success");
      setEmail("");
      localStorage.setItem("user_subscribed", "true");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-md p-5 shadow-xl transition-all duration-300 hover:border-primary/40",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BellRing className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Master this Series</h3>
            <p className="text-[10px] text-slate-400 leading-tight">Never miss a new module</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-4 text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="mb-2 h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-white">You&apos;re on the list!</p>
            <p className="mt-1 text-xs text-slate-400">{message || "We'll notify you of new updates."}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-xs font-medium text-primary hover:underline transition-all"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-300 leading-relaxed">
              Get notified immediately when new content is added to{ " " }
              <span className="font-semibold text-white">{seriesName || "this series"}</span>.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-3 py-2 text-xs font-bold text-black transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Stay Updated</span>
                  </>
                )}
              </button>
            </form>

            {status === "error" && (
              <div className="flex items-center gap-2 text-xs text-red-400 mt-1 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3 w-3" />
                <span>{message}</span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 text-center">
              No spam. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
