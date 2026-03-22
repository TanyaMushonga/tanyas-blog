import React from "react";
import { Metadata } from "next";
import SeriesCard from "@/components/series/SeriesCard";
import { BookOpen } from "lucide-react";

export const revalidate = false; // Indefinite caching

async function getCollections() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/collections`, {
    next: { revalidate: false },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch collections");
  }

  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  const collections = await getCollections();
  const firstCollection = collections[0];

  return {
    title: "Learning Series - Tanya's Blog",
    description:
      "Explore our curated collections of articles and tutorials organized into easy-to-follow learning paths.",
    openGraph: {
      title: "Learning Series - Tanya's Blog",
      description: "Curated learning paths for modern developers.",
      images: firstCollection?.coverImgUrl
        ? [{ url: firstCollection.coverImgUrl }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Learning Series - Tanya's Blog",
      description: "Curated learning paths for modern developers.",
      images: firstCollection?.coverImgUrl ? [firstCollection.coverImgUrl] : [],
    },
  };
}

export default async function SeriesListPage() {
  const collections: Collection[] = await getCollections();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="mb-12 max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <BookOpen className="h-4 w-4" />
          <span>Curated Learning Paths</span>
        </div>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
          Level Up Your <span className="text-primary">Skills</span>
        </h1>
        <p className="text-lg text-slate-400 md:text-xl">
          Hand-picked collections of articles designed to take you from basics
          to advanced concepts in software engineering and technology.
        </p>
      </header>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <SeriesCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-card/10 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold text-white">No series found</h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;re working on new content. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
