import { Suspense } from "react";
import dynamic from "next/dynamic";
import { BlogSkeleton } from "@/components/common/blogSkeleton";
import Article from "@/components/common/article";
import Latestblog from "@/components/common/latestblog";
import LatestSkeleton from "@/components/common/latestSkeleton";
import SeriesHighlight from "@/components/series/SeriesHighlight";

const ArticleTabs = dynamic(() => import("@/components/common/articleTabs"));

async function getArticles() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog?page=1&page_size=12`,
      {
        next: { revalidate: false },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.blogs || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

async function getCollections() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      next: { revalidate: false },
    });
    if (!res.ok) throw new Error("Failed to fetch collections");
    return res.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

export default async function Home() {
  const [articles, collections] = await Promise.all([
    getArticles(),
    getCollections(),
  ]);

  const latestBlog = articles[0] || null;
  const featuredArticles = articles.slice(3, 6);

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container max-w-8xl mx-auto px-4 md:px-6 flex flex-col gap-8">
        {/* Hero Section - Featured Latest Blog */}
        {latestBlog && (
          <section>
            <Suspense fallback={<LatestSkeleton />}>
              <Latestblog latestBlog={latestBlog} />
            </Suspense>
          </section>
        )}

        {/* Featured Articles - 3 Column Grid */}
        {featuredArticles.length > 0 && (
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Featured Articles
              </h2>
              <p className="text-muted-foreground">
                Hand-picked deep dives on system design and engineering.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Article
                  key={article.slug}
                  blog={article}
                  showImage={false}
                  variant="card"
                />
              ))}
            </div>
          </section>
        )}

        {/* Series Highlights */}
        {collections.length > 0 && (
          <section>
            <SeriesHighlight collections={collections} />
          </section>
        )}

        {/* Main Content: Filter Tabs -> Vertical Article List */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Latest Articles
            </h2>
            <p className="text-muted-foreground">
              Deep dives into System Design, DevOps, and Engineering practices.
            </p>
          </div>
          <Suspense fallback={<BlogSkeleton />}>
            <ArticleTabs initialArticles={articles} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
