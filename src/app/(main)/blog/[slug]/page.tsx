import React, { Suspense } from "react";
import Related from "@/components/common/related";
import ReadSkeleton from "@/components/common/readSkeleton";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import TableOfContents from "@/components/common/tableOfContents";
import Link from "next/link";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import SubscribeModalTrigger from "@/components/common/SubscribeModalTrigger";

const Read = React.lazy(() => import("@/components/common/read"));

export const revalidate = false;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getArticleAndRelated(slug: string) {
  try {
    const articleRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog/${slug}`,
      { next: { revalidate: false } },
    );

    if (!articleRes.ok) {
      if (articleRes.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch article: ${articleRes.statusText}`);
    }

    const articleData = await articleRes.json();
    const article: Article = articleData;
    const relatedRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog?page=1&page_size=50`,
      { next: { revalidate: false } },
    );

    let related: Article[] = [];
    if (relatedRes.ok) {
      const relatedData = await relatedRes.json();
      const articles: Article[] = relatedData.blogs || [];
      related = articles
        .filter(
          (relatedArticle: Article) =>
            relatedArticle.category === article.category &&
            relatedArticle.slug !== article.slug,
        )
        .slice(0, 3); // Take only first 3
    }
    return { article, related };
  } catch (error) {
    console.error(`Error fetching data for slug ${slug}:`, error);
    throw error;
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog?page=1&page_size=50`,
      { next: { revalidate: false } },
    );

    if (!response.ok) {
      console.warn(
        `Failed to fetch blogs for static generation: ${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();
    const blogs: Article[] = data.blogs || [];

    return blogs.map((blog: Article) => ({ slug: blog.slug }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const slug = (await params).slug;

    // Fetch only the article for metadata, don't try to get related
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog/${slug}`,
      { next: { revalidate: false } },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          title: "Article Not Found - Tanya's Blog",
          description: "The requested article could not be found.",
        };
      }
      throw new Error(
        `Failed to fetch article metadata: ${response.statusText}`,
      );
    }

    const article: Article = await response.json();

    if (!article) {
      return {
        title: "Error - Tanya's Blog",
        description: "An error occurred while fetching article metadata.",
      };
    }

    return {
      title: `${article.title} - Tanya's Blog`,
      description: article.description || "Read this article on Tanya's Blog",
      keywords: article.keywords || [],
      authors: [
        { name: "Tanyaradzwa Tanatswa Mushonga" },
        {
          name: "Tanyaradzwa Tanatswa Mushonga",
          url: "https://www.tanyaradzwatmushonga.me/",
        },
      ],
      publisher: "Tanya's Blog",
      openGraph: {
        title: article.title,
        description: article.description || "",
        type: "article",
        publishedTime: article.publishedAt || article.updatedAt,
        authors: ["Tanyaradzwa Tanatswa Mushonga"],
        images: article.coverImgUrl
          ? [
              {
                url: article.coverImgUrl,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description || "",
        images: article.coverImgUrl ? [article.coverImgUrl] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error - Tanya's Blog",
      description: "An error occurred while fetching article metadata.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const slug = (await params).slug;
    const { article, related } = await getArticleAndRelated(slug);

    return (
      <div className="flex flex-col lg:flex-row w-full gap-5 md:px-5 pt-5">
        <ScrollProgressBar />
        <SubscribeModalTrigger slug={slug} />
        <div className="lg:w-2/3 w-full p-4 md:p-5 mt-5">
          <Suspense fallback={<ReadSkeleton />}>
            <Read article={article} />
            {related.length > 0 && <Related related={related} />}
          </Suspense>
        </div>
        <div className="lg:w-1/3 lg:block mt-5 sticky top-20 h-[calc(100vh-100px)]">
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading table of contents...
              </div>
            }
          >
            <TableOfContents content={article?.content} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering page:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;re having trouble loading this article. Please try again
            later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}
