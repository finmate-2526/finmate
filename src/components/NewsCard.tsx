import { ExternalLink, Clock } from "lucide-react";
import React from "react";

export interface NewsItem {
  uuid: string;
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
  time_ago?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  if (!news) return null;

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-neutral-900/50 border border-neutral-700 rounded-xl hover:bg-neutral-800/60 transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h4 className="text-base font-semibold leading-snug text-neutral-100">
            {news.title}
          </h4>

          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="font-medium">{news.source}</span>

            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{news.time_ago}</span>
            </div>
          </div>
        </div>

        <ExternalLink
          size={16}
          className="flex-shrink-0 text-neutral-500 mt-1"
        />
      </div>
    </a>
  );
};

export default NewsCard;
