import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { CalendarDays, Timer } from "lucide-react";
import React from "react";
import SUbscribe from "./Subscribe";
import Comments from "./comments";

function Read({ article }: { article: Article }) {
  return (
    <div className="max-w-4xl mx-auto antialiased pt-4 md:pt-8 pb-20 md:px-0 relative">
      {/* Header Section */}
      <header className="mb-5 text-left border-b border-border/50 pb-2">
        <div className="flex items-center gap-2 mb-6 justify-start">
          <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
            {article.category && article.category !== "null"
              ? article.category
              : "Article"}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {article?.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 text-slate-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full">
                <Image
                  src="https://vhwltxiaz42mcyxk.public.blob.vercel-storage.com/profile.jpg"
                  width={28}
                  height={28}
                  alt="Author"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase">
                  Written by
                </span>
                <Link
                  href="https://tanyaradzwatmushonga.me"
                  className="text-white hover:text-primary transition-colors font-medium text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanyaradzwa
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span>{article?.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>
                {formatDate(
                  new Date(article?.publishedAt || article?.updatedAt),
                )}
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content - Utilizing the Updated Global CSS .prose */}
      <article className="prose prose-slate prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: article?.content || "" }} />
      </article>

      <SUbscribe />
      <Comments article={article} />
    </div>
  );
}

export default React.memo(Read);
