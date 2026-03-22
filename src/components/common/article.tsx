"use client";

import { formatDate } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

interface ArticleProps {
  blog: Article;
  className?: string;
  showImage?: boolean;
  variant?: "card" | "compact";
}

function Article({
  blog,
  className = "",
  showImage = false,
  variant = "card",
}: ArticleProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    router.push(`/blog/${blog.slug}`);
  };

  // Compact variant - for vertical list layout
  if (variant === "compact") {
    return (
      <div
        className="group flex items-start justify-between gap-4 w-full cursor-pointer p-3"
        onClick={handleClick}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2">
            {blog?.title}
          </h3>
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {blog?.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
            <time suppressHydrationWarning>
              {formatDate(new Date(blog?.publishedAt || blog?.updatedAt))}
            </time>
            <span>•</span>
            <span>{blog?.readTime}</span>
            <span>•</span>
            <span className="px-2 py-1 rounded-full text-cyan-400/70 bg-cyan-900/20 capitalize">
              {blog?.category && blog.category !== "null"
                ? blog.category
                : "Article"}
            </span>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-gray-600 group-hover:text-cyan-400 transition-all duration-200 shrink-0 mt-1" />
      </div>
    );
  }

  // Card variant - for grid layouts
  return (
    <div
      className={`group flex flex-col gap-4 p-4 rounded-xl bg-card/50 border border-transparent hover:border-primary/50 hover:bg-card transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {showImage && blog?.coverImgUrl && (
        <div className="relative w-full aspect-3/2 overflow-hidden rounded-lg bg-gray-800">
          <Image
            src={blog?.coverImgUrl}
            fill
            alt={blog.title}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="/placeholderblur.png"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {blog?.title}
        </h2>

        <p className="text-sm text-slate-400 line-clamp-2">
          {blog?.description}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span suppressHydrationWarning>
            {formatDate(new Date(blog?.publishedAt || blog?.updatedAt))}
          </span>
          <span>{blog?.readTime}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <span className="px-2 py-1 text-xs rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-700/50">
            {blog?.category && blog.category !== "null"
              ? blog.category.toUpperCase()
              : "ARTICLE"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Article;
