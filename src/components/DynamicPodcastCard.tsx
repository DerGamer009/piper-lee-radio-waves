
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Podcast } from "@/services/podcastService";

interface DynamicPodcastCardProps {
  podcast: Podcast;
}

const DynamicPodcastCard: React.FC<DynamicPodcastCardProps> = ({ podcast }) => {
  // Formatiere das Datum als "vor X Tagen/Stunden"
  const formattedDate = formatDistanceToNow(new Date(podcast.published_at), {
    addSuffix: true,
    locale: de
  });
  
  return (
    <div className="bg-card/30 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={podcast.image_url} 
          alt={podcast.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
          <p className="text-sm text-white">{formattedDate}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{podcast.title}</h3>
        <p className="text-sm text-radio-light/70">Mit {podcast.host}</p>
        <div className="mt-2 text-xs text-radio-light/50">
          <span className="inline-block bg-radio-purple/20 text-radio-purple rounded-full px-2 py-0.5">
            {podcast.duration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DynamicPodcastCard;
