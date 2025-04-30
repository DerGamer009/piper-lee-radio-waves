
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PollOption, voteForOption } from "@/services/pollService";

interface DynamicPollWidgetProps {
  question: string;
  options: PollOption[];
}

const DynamicPollWidget: React.FC<DynamicPollWidgetProps> = ({ question, options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Berechne die Gesamtzahl der Stimmen
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = async () => {
    if (!selectedOption || hasVoted || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await voteForOption(selectedOption);
      
      if (success) {
        setHasVoted(true);
        toast({
          title: "Vielen Dank!",
          description: "Ihre Stimme wurde erfolgreich abgegeben.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Ihre Stimme konnte nicht gezählt werden. Bitte versuchen Sie es später erneut.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="bg-card/30 backdrop-blur-sm text-foreground">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-radio-purple" />
          <h3 className="text-xl font-semibold">{question}</h3>
        </div>
        
        <div className="space-y-3 mb-4">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            
            return (
              <div key={option.id} className="relative">
                <div
                  className={`flex items-center rounded-md border p-3 ${
                    selectedOption === option.id
                      ? "border-radio-purple bg-radio-purple/10"
                      : "border-input hover:bg-accent"
                  } ${hasVoted ? "pointer-events-none" : "cursor-pointer"}`}
                  onClick={() => !hasVoted && setSelectedOption(option.id)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{option.option_text}</div>
                  </div>
                  {hasVoted && (
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {percentage}% ({option.votes})
                    </div>
                  )}
                </div>
                {hasVoted && (
                  <div
                    className="absolute left-0 top-0 h-full bg-radio-purple/20 rounded-l-md"
                    style={{ width: `${percentage}%`, maxWidth: "100%" }}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {!hasVoted && (
          <Button
            className="w-full bg-radio-purple hover:bg-radio-purple/80"
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? "Wird verarbeitet..." : "Abstimmen"}
          </Button>
        )}
        
        {hasVoted && (
          <div className="text-center text-sm text-muted-foreground">
            Vielen Dank für Ihre Teilnahme!
            <div className="mt-1">
              Gesamtstimmen: <span className="font-medium">{totalVotes}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicPollWidget;
