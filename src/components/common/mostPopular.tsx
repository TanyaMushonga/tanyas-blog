import React from "react";
import { Pin } from "lucide-react";
import { formatDate, getRandomArticles } from "@/lib/utils";
import MostPopularHeader from "./mostPopularHeader";
import RouteLayout from "./routeLayout";

function Mostpopular({ mostPopular }: { mostPopular: Article[] }) {
  return (
    <div className="lg:flex flex-col gap-4 mb-4">
      <MostPopularHeader />
      <div className="flex md:flex-row flex-col gap-4">
        {getRandomArticles(mostPopular, 3).map((article) => (
          <RouteLayout
            className="bg-card w-full md:w-1/3 rounded-lg flex flex-row justify-between cursor-pointer gap-2"
            key={article?.slug}
            link={`/blog/${article?.slug}`}
          >
            <div className="flex flex-col">
              <p className="text-white text-md font-bold line-clamp-2">
                {article?.title}
              </p>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <Pin className="text-slate-300 mr-2" />
                  <p className="text-white">
                    {formatDate(new Date(article?.updatedAt))}
                  </p>
                </div>
              </div>
            </div>
          </RouteLayout>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Mostpopular);
