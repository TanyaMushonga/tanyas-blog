import Link from "next/link";
import React, { Suspense } from "react";
import { Terminal } from "lucide-react";

const Search = React.lazy(() => import("./search"));

export default async function Navbar() {
  let articles: Article[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog?page=1&page_size=50`,
      { next: { revalidate: false } }
    );

    if (res.ok) {
      const data = await res.json();
      articles = data.blogs || [];
    }
  } catch (error) {
    console.error("Failed to fetch articles for search:", error);
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        {/* Logo Section with coding-appropriate fonts */}
        <Link
          prefetch={false}
          href="/"
          className="group flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
        >
          {/* Animated terminal icon */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary/30 to-primary/30 rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-500" />
            <div className="relative bg-linear-to-br from-card to-gray-900 p-1.5 sm:p-2 rounded-lg border border-gray-800 group-hover:border-primary/50 transition-all duration-300">
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-xl font-bold tracking-tight bg-linear-to-r from-gray-200 via-primary/25 to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary/80 group-hover:to-primary transition-all duration-300 font-mono">
              Tanya&apos;s Blog
            </span>
            <span className="text-[8px] sm:text-[10px] text-gray-400 font-medium tracking-widest sm:tracking-[0.2em] uppercase font-mono">
              <span className="text-primary">{"<"} </span>
              Code • Tech • Insights
              <span className="text-primary"> {" />"}</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          {/* Mobile Portfolio Icon */}
          <Link
            href="https://tanyaradzwatmushonga.me"
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all flex items-center justify-center text-primary"
            title="My Portfolio"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </Link>

          <Link
            href="https://tanyaradzwatmushonga.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative hidden lg:inline-flex items-center gap-2.5 px-5 py-2 text-sm font-bold text-white transition-all duration-300"
          >
            {/* Glossy background effect */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl opacity-80 group-hover/btn:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover/btn:opacity-20 blur-sm transition-opacity" />

            <span className="relative z-10">My Portfolio</span>
            <div className="relative z-10 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 text-white transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </Link>

          <div className="h-6 w-px bg-white/20 mx-1" />

          {/* Search Section */}
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <div className="hidden md:block h-9 w-36 rounded-lg bg-linear-to-r from-gray-800 to-gray-900 animate-pulse border border-gray-800" />
                <div className="md:hidden h-9 w-9 rounded-lg bg-gray-900 animate-pulse border border-gray-800" />
              </div>
            }
          >
            <Search articles={articles} />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
