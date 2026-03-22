import React from "react";
import { Timer, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";
import RouteLayout from "./routeLayout";

function Latestblog({ latestBlog }: { latestBlog: Article }) {
  if (!latestBlog) return null;

  return (
    <RouteLayout
      className="group relative flex md:flex-row flex-col gap-8 items-start pb-10 cursor-pointer border-b border-border/50"
      link={`/blog/${latestBlog.slug}`}
    >
      <div className="flex flex-col gap-4 w-full justify-center">
        <div className="inline-flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Latest
          </span>
        </div>

        <h1 className="text-3xl md:text-3xl font-extrabold text-white leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-3">
          {latestBlog.title}
        </h1>

        <p className="text-slate-400 text-lg line-clamp-3 leading-relaxed">
          {latestBlog.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span>{latestBlog.readTime} read</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <time suppressHydrationWarning>
              {formatDate(
                new Date(latestBlog.publishedAt || latestBlog.updatedAt),
              )}
            </time>
          </div>
        </div>
      </div>
    </RouteLayout>
  );
}

export default React.memo(Latestblog);
