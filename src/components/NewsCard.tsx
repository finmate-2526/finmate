import { ExternalLink, Clock } from "lucide-react";

interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: "positive" | "negative" | "neutral";
}

export const NewsCard = ({ news }: { news: NewsItem }) => {
  const sentimentDot = {
    positive: "bg-green-500",
    negative: "bg-red-500",
    neutral: "bg-gray-400",
  }[news.sentiment || "neutral"];

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
    >
      <div className="flex items-start justify-between gap-3">

        {/* TEXT CONTENT */}
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-medium text-gray-900 leading-snug">
            {news.title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{news.source}</span>
            <span>•</span>

            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{news.publishedAt}</span>
            </div>

            {news.sentiment && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${sentimentDot}`} />
                  <span className="capitalize">{news.sentiment}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* EXTERNAL LINK ICON */}
        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </div>
    </a>
  );
};
