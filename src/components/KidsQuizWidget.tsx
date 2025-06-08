
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, CheckCircle, XCircle, Trophy } from "lucide-react";

const KidsQuizWidget = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const questions = [
    {
      question: "Welches Tier macht 'Miau'?",
      answers: ["Hund", "Katze", "Kuh", "Vogel"],
      correct: 1
    },
    {
      question: "Wie viele Beine hat eine Spinne?",
      answers: ["6", "8", "4", "10"],
      correct: 1
    },
    {
      question: "Welche Farbe bekommt man, wenn man Rot und Blau mischt?",
      answers: ["Grün", "Orange", "Lila", "Gelb"],
      correct: 2
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
      }
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <Card className="bg-gradient-to-br from-green-100/50 to-blue-100/50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200/50 dark:border-green-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quiz Ergebnis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <p className="text-xl font-bold">Toll gemacht!</p>
          <p className="text-lg">Du hast {score} von {questions.length} Fragen richtig beantwortet!</p>
          <Button 
            onClick={resetQuiz}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Nochmal spielen!
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          Kinder-Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Frage {currentQuestion + 1} von {questions.length}
          </p>
          <h3 className="text-lg font-medium mb-4">
            {questions[currentQuestion].question}
          </h3>
        </div>
        
        <div className="space-y-2">
          {questions[currentQuestion].answers.map((answer, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              variant="outline"
              className={`w-full text-left justify-start transition-all ${
                selectedAnswer === index
                  ? index === questions[currentQuestion].correct
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20'
                  : selectedAnswer !== null && index === questions[currentQuestion].correct
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20'
                  : 'border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              {selectedAnswer === index && (
                index === questions[currentQuestion].correct 
                  ? <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  : <XCircle className="h-4 w-4 mr-2 text-red-600" />
              )}
              {selectedAnswer !== null && selectedAnswer !== index && index === questions[currentQuestion].correct && (
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              )}
              {answer}
            </Button>
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Aktuelle Punkte: {score}
        </div>
      </CardContent>
    </Card>
  );
};

export default KidsQuizWidget;
