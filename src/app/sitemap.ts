import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageSize = 10;
  let page = 1;
  let allBlogs: Article[] = [];
  let blogs: Article[] = [];

  do {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/blog?page=${page}&page_size=${pageSize}`
    );
    const data = await response.json();
    blogs = data.blogs;

    if (Array.isArray(blogs) && blogs.length > 0) {
      allBlogs = allBlogs.concat(blogs);
      page++;
    }
  } while (Array.isArray(blogs) && blogs.length === pageSize);

  const blogEntries: MetadataRoute.Sitemap = allBlogs.map(
    ({ slug, updatedAt }) => ({
      url: `https://blog.tanyaradzwatmushonga.me/blog/${slug}`,
      lastModified: new Date(updatedAt).toISOString(),
      priority: 0.9,
      changeFrequency: "weekly",
    })
  );

  // Fetch Collections (Series)
  const collectionsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "https://console.tanyaradzwatmushonga.me/api"}/collections`
  );
  const collections: Collection[] = await collectionsResponse.json();

  const seriesEntries: MetadataRoute.Sitemap = [
    {
      url: `https://blog.tanyaradzwatmushonga.me/series`,
      priority: 0.8,
      changeFrequency: "weekly",
    },
  ];

  if (Array.isArray(collections)) {
    collections.forEach((collection) => {
      seriesEntries.push({
        url: `https://blog.tanyaradzwatmushonga.me/series/${collection.slug}`,
        lastModified: new Date(collection.updatedAt).toISOString(),
        priority: 0.8,
        changeFrequency: "weekly",
      });

      collection.articles?.forEach((article) => {
        if (article.status === "published") {
          seriesEntries.push({
            url: `https://blog.tanyaradzwatmushonga.me/series/${collection.slug}/${article.slug}`,
            lastModified: new Date(article.updatedAt).toISOString(),
            priority: 0.7,
            changeFrequency: "weekly",
          });
        }
      });
    });
  }

  return [
    {
      url: `https://blog.tanyaradzwatmushonga.me/`,
      priority: 1,
      changeFrequency: "daily",
    },
    ...blogEntries,
    ...seriesEntries,
  ];
}
