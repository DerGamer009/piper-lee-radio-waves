
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollWidgetProps {
  question: string;
  options: PollOption[];
}

const PollWidget = ({ question, options: initialOptions }: PollWidgetProps) => {
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [voted, setVoted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = (optionId: string) => {
    if (voted) return;
    
    setOptions(options.map(option => 
      option.id === optionId 
        ? { ...option, votes: option.votes + 1 } 
        : option
    ));
    
    setVoted(true);
    
    toast({
      title: "Danke für Ihre Abstimmung!",
      description: "Ihre Stimme wurde gezählt.",
    });
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    toast({
      title: "Kommentar gesendet!",
      description: "Vielen Dank für Ihr Feedback.",
    });
    
    setComment("");
    setShowComment(false);
  };
  
  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-medium mb-4">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <div key={option.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">{option.text}</span>
              <span className="text-xs text-radio-light/70">
                {voted ? `${option.votes} Stimmen` : ""}
              </span>
            </div>
            
            <div className="relative h-8">
              <div 
                className="absolute inset-0 bg-card/50 rounded-md"
                onClick={() => handleVote(option.id)}
              >
                <div 
                  className="h-full bg-radio-purple/30 rounded-md transition-all duration-500 flex items-center px-3"
                  style={{ 
                    width: voted ? `${(option.votes / totalVotes) * 100}%` : "0%" 
                  }}
                >
                  {voted && (option.votes / totalVotes) * 100 > 15 && (
                    <span className="text-xs font-medium">{Math.round((option.votes / totalVotes) * 100)}%</span>
                  )}
                </div>
              </div>
              
              {!voted && (
                <Button 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                  onClick={() => handleVote(option.id)}
                >
                  Abstimmen
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {voted && (
        <div className="flex justify-between items-center border-t border-white/10 pt-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-radio-light/70 hover:text-white">
              <ThumbsUp className="h-4 w-4 mr-1" /> Gefällt mir
            </Button>
            
            <Button variant="ghost" size="sm" className="text-radio-light/70 hover:text-white">
              <ThumbsDown className="h-4 w-4 mr-1" /> Gefällt mir nicht
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-radio-light/70 hover:text-white"
            onClick={() => setShowComment(!showComment)}
          >
            <MessageCircle className="h-4 w-4 mr-1" /> Kommentar
          </Button>
        </div>
      )}
      
      {showComment && (
        <form onSubmit={handleCommentSubmit} className="mt-4 border-t border-white/10 pt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Schreiben Sie einen Kommentar..."
            className="w-full rounded-md border border-radio-light/20 bg-card/30 px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm mt-1 min-h-[80px]"
            required
          />
          
          <div className="flex justify-end mt-2 gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowComment(false)}
            >
              Abbrechen
            </Button>
            
            <Button 
              type="submit" 
              size="sm"
              className="bg-radio-purple hover:bg-radio-purple/90"
            >
              Senden
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PollWidget;
