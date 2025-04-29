
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { fetchAllNews, NewsItem } from "@/services/newsService";

const NewsTeaser = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchAllNews();
        setNews(data.slice(0, 3)); // Nur die neuesten 3 News anzeigen
      } catch (error) {
        console.error("Fehler beim Laden der News:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card/10 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-12" id="news">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Aktuelle News</h2>
          <Button asChild variant="ghost" className="text-radio-light hover:text-white">
            <Link to="/news" className="flex items-center gap-1">
              Alle News
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map(item => (
            <Link 
              key={item.id}
              to={`/news/${item.id}`}
              className="bg-card/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-card/20 transition-colors"
            >
              {item.image_url && (
                <AspectRatio ratio={16/9}>
                  <img 
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <div className="flex items-center text-sm text-radio-light mb-2">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(item.published_at)}
                </div>
                <p className="text-sm text-radio-light/80 line-clamp-2">{item.content}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsTeaser;
