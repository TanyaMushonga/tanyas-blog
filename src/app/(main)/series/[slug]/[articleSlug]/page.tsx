import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Read from "@/components/common/read";
import TableOfContents from "@/components/common/tableOfContents";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import Related from "@/components/common/related";
import ReadSkeleton from "@/components/common/readSkeleton";
import { ArrowLeft } from "lucide-react";
import SubscribeModalTrigger from "@/components/common/SubscribeModalTrigger";

interface NestedArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch article");
  }

  return res.json();
}

async function getCollection(slug: string): Promise<Collection | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/collections/${slug}`,
      {
        next: { revalidate: false },
      },
    );

    if (!res.ok) {
      console.error(`Failed to fetch collection ${slug}: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();

    let collection: Collection | null = null;
    if (data.collection) collection = data.collection;
    else if (data.series) collection = data.series;
    else collection = data;

    return collection;
  } catch (error) {
    console.error(`Error in getCollection for slug ${slug}:`, error);
    return null;
  }
}

async function getRelatedArticles(
  category: string,
  currentSlug: string,
): Promise<Article[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog?page=1&page_size=50`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return [];

  const data = await res.json();
  const articles: Article[] = data.blogs || [];

  return articles
    .filter((a) => a.category === category && a.slug !== currentSlug)
    .slice(0, 3);
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/collections`);
  if (!res.ok) return [];
  const collections: Collection[] = await res.json();

  const paths: { slug: string; articleSlug: string }[] = [];

  collections.forEach((collection) => {
    collection.articles?.forEach((article) => {
      paths.push({
        slug: collection.slug,
        articleSlug: article.slug,
      });
    });
  });

  return paths;
}

export async function generateMetadata({
  params,
}: NestedArticlePageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const article = await getArticle(resolvedParams.articleSlug);

    if (!article) {
      return {
        title: "Article Not Found - Tanya's Blog",
      };
    }

    return {
      title: `${article.title} - Tanya's Blog`,
      description: article.description,
      keywords:
        article.keywords?.length > 0 ? article.keywords.join(", ") : undefined,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        publishedTime: article.publishedAt || article.updatedAt,
        images: article.coverImgUrl ? [{ url: article.coverImgUrl }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
        images: article.coverImgUrl ? [article.coverImgUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for series article page:", error);
    return {
      title: "Error - Tanya's Blog",
    };
  }
}

export default async function SeriesArticleReaderPage({
  params,
}: NestedArticlePageProps) {
  const resolvedParams = await params;
  const { slug: seriesSlug, articleSlug } = resolvedParams;

  const [article, collection] = await Promise.all([
    getArticle(articleSlug),
    getCollection(seriesSlug),
  ]);

  if (!article) {
    notFound();
  }

  // Security check: Only allow access if status is "published"
  const isPublished = article.status === "published";

  if (!isPublished) {
    redirect(`/series/${seriesSlug}`);
  }

  const related = await getRelatedArticles(article.category, articleSlug);

  return (
    <main className="min-h-screen pb-16 md:pb-20">
      <div className="container max-w-8xl mx-auto px-1 md:px-6 flex flex-col gap-16">
        <ScrollProgressBar />
        <SubscribeModalTrigger slug={articleSlug} />
        <div className="mx-auto flex flex-col lg:flex-row w-full gap-8 md:px-5 pt-12 md:pt-24">
          <div className="lg:w-2/3 w-full p-4 md:p-5">
            <div className="max-w-4xl mx-auto">
              <Link
                href={`/series/${seriesSlug}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-primary transition-colors mb-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card/50 border border-border/50 group-hover:border-primary/50 transition-all">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </div>
                Back to {collection?.name || "Series"}
              </Link>
            </div>

            <Suspense fallback={<ReadSkeleton />}>
              <Read article={article} />
              {related.length > 0 && <Related related={related} />}
            </Suspense>
          </div>

          <aside className="lg:w-1/3 lg:block mt-5 sticky top-24 h-[calc(100vh-120px)] hidden">
            <Suspense
              fallback={
                <div className="animate-pulse h-40 bg-muted/10 rounded-xl" />
              }
            >
              <TableOfContents content={article.content} />
            </Suspense>
          </aside>
        </div>
      </div>
    </main>
  );
}
