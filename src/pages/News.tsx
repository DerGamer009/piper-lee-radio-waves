
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { fetchAllNews, fetchNewsById, NewsItem } from "@/services/newsService";

const NewsPage = () => {
  const { id } = useParams<{ id?: string }>();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        if (id) {
          // Use the id directly as a string, no need to parse it as an integer
          const newsItem = await fetchNewsById(id);
          setSelectedNews(newsItem);
          const allNews = await fetchAllNews();
          setNews(allNews);
        } else {
          const allNews = await fetchAllNews();
          setNews(allNews);
        }
      } catch (error) {
        console.error("Fehler beim Laden der News:", error);
        toast({
          title: "Fehler",
          description: "Die News konnten nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id]);

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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (id && selectedNews) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Button asChild variant="ghost" className="mb-6 text-radio-light hover:text-white">
          <Link to="/news" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Alle News
          </Link>
        </Button>
        
        <article className="max-w-4xl mx-auto bg-card/10 backdrop-blur-sm p-6 md:p-8 rounded-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{selectedNews.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-4 text-sm text-radio-light">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(selectedNews.published_at)}
            </span>
            {selectedNews.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {selectedNews.author}
              </span>
            )}
          </div>
          
          {selectedNews.image_url && (
            <div className="mb-6">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded-md">
                <img 
                  src={selectedNews.image_url}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          )}
          
          <div className="text-radio-light space-y-4 mb-8">
            {selectedNews.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          
          {selectedNews.tags && selectedNews.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <Tag className="h-4 w-4 text-radio-light/70" />
              {selectedNews.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-radio-blue/20 text-radio-light px-2 py-1 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
        
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-xl font-bold mb-6">Weitere News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.filter(item => item.id !== selectedNews.id)
              .slice(0, 2)
              .map(item => (
                <Link 
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="bg-card/10 backdrop-blur-sm p-4 rounded-lg hover:bg-card/20 transition-colors"
                >
                  {item.image_url && (
                    <div className="mb-3">
                      <AspectRatio ratio={16/9} className="overflow-hidden rounded-md">
                        <img 
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-radio-light/70">{formatDate(item.published_at)}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-radio-light hover:text-white">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-6">News & Updates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => (
          <Link 
            key={item.id}
            to={`/news/${item.id}`}
            className="bg-card/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-card/20 transition-colors"
          >
            {item.image_url && (
              <div>
                <AspectRatio ratio={16/9}>
                  <img 
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="p-4 md:p-5">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <div className="flex items-center gap-2 text-sm text-radio-light/80 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(item.published_at)}</span>
              </div>
              <p className="text-radio-light line-clamp-3">
                {item.content}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
