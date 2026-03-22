"use client";
import { subscribe } from "@/actions/subscribe";
import React, { useState } from "react";
import { MailOpen, Loader2 } from "lucide-react";

function SUbscribe() {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors("");
      setMessage("");
      if (!email) {
        setErrors("Email is required");
        setLoading(false);
        return;
      }

      const message = await subscribe(email);
      setMessage(message);
      setEmail("");
      
      // Persist subscription status
      localStorage.setItem("user_subscribed", "true");
    } catch {
      setErrors("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-8 md:p-12">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
          <MailOpen />
          <span>Newsletter</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Level Up Your Tech Knowledge
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Join 5,000+ developers receiving expert insights, coding tips, and
          exclusive content delivered straight to your inbox.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3 rounded-lg bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={email}
            onChange={onChange}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Subscribe Free"
            )}
          </button>
        </form>

        {errors && <p className="text-red-400 mt-3 text-sm">{errors}</p>}
        {message && <p className="text-green-400 mt-3 text-sm">{message}</p>}

        <p className="text-slate-500 text-xs mt-4">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}

export default SUbscribe;
