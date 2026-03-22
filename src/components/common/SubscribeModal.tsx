"use client";

import React, { useState } from "react";
import { MailOpen, Loader2 } from "lucide-react";
import { subscribe } from "@/actions/subscribe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubscribeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscribeModal({
  isOpen,
  onOpenChange,
}: SubscribeModalProps) {
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

      const resMessage = await subscribe(email);
      setMessage(resMessage);
      setEmail("");
      
      // Persist subscription status
      localStorage.setItem("user_subscribed", "true");

      // Close modal after success after a short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch {
      setErrors("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-indigo-500/30 bg-slate-900 text-white overflow-hidden p-0">
        <div className="relative p-8 md:p-10">
          {/* Background Decor */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10"></div>

          <DialogHeader className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-4 w-fit">
              <MailOpen className="w-4 h-4" />
              <span>Newsletter</span>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-bold text-white mb-2 text-left">
              Level Up Your Tech Knowledge
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-lg text-left">
              Join 5,000+ developers receiving expert insights and coding tips.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-5 py-3 rounded-lg bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={email}
              onChange={onChange}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Subscribe Free"
              )}
            </button>
          </form>

          {errors && <p className="text-red-400 mt-3 text-sm">{errors}</p>}
          {message && <p className="text-green-400 mt-3 text-sm">{message}</p>}

          <p className="text-slate-500 text-xs mt-6 text-center">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
