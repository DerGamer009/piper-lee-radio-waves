
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Baby, Music, Headphones, Calendar, Heart, Star, Gamepad2, Clock, Lightbulb, Palette, HelpCircle, Mic, Shield } from "lucide-react";
import KidsRadioPlayer from "@/components/KidsRadioPlayer";
import KidsGameWidget from "@/components/KidsGameWidget";
import KidsScheduleWidget from "@/components/KidsScheduleWidget";
import KidsFactWidget from "@/components/KidsFactWidget";
import KidsSongRequestWidget from "@/components/KidsSongRequestWidget";
import KidsDrawingWidget from "@/components/KidsDrawingWidget";
import KidsQuizWidget from "@/components/KidsQuizWidget";
import KidsVoiceMessageWidget from "@/components/KidsVoiceMessageWidget";
import { Alert, AlertDescription } from "@/components/ui/alert";

const KIDS_STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee_-_kids/radio.mp3";
const STATION_NAME = "Piper Lee Kids Radio";

const Kids = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <>
      <section 
        className={`min-h-[85vh] relative flex items-center transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background gradient with kid-friendly colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/20 via-pink-200/10 to-blue-200/20 dark:from-yellow-500/10 dark:via-pink-500/5 dark:to-blue-500/10 pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Baby className="h-8 w-8 text-pink-500" />
                <Star className="h-6 w-6 text-yellow-500" />
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-foreground">Kids Radio</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                  Spaß
                </span>
              </h1>
              
              <p className="text-xl text-foreground/80 mb-8 max-w-lg mx-auto lg:mx-0">
                Willkommen bei Piper Lee Kids Radio! Hier gibt es die beste Musik und spannende Geschichten für alle kleinen Hörer.
              </p>
              
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
                  asChild
                >
                  <Link to="/sendeplan">Programm</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500 text-purple-500 hover:bg-purple-500/10 rounded-full px-6"
                  asChild
                >
                  <Link to="/podcasts">Geschichten</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-full px-6"
                  asChild
                >
                  <Link to="/songwunsch">Lied wünschen</Link>
                </Button>
              </div>
              
              <Alert className="mt-6 border-yellow-400 bg-yellow-400/10">
                <Heart className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  <strong>Für Kinder gemacht:</strong> Alle Inhalte sind kindgerecht und sicher für kleine Ohren!
                </AlertDescription>
              </Alert>

              {/* GEMA Information */}
              <Alert className="mt-4 border-green-400 bg-green-400/10">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  <strong>GEMA-abgesichert:</strong> Alle Musik wird legal und sicher über die GEMA gespielt!
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
              <KidsRadioPlayer streamUrl={KIDS_STREAM_URL} stationName={STATION_NAME} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Kids Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50/50 via-yellow-50/50 to-pink-50/50 dark:from-orange-900/10 dark:via-yellow-900/10 dark:to-pink-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Spiel und Spaß!</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Entdecke coole Spiele und erfahre spannende Fakten während du Musik hörst!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KidsGameWidget />
            <KidsScheduleWidget />
            <KidsFactWidget />
            <KidsSongRequestWidget />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-green-50/50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-green-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kreativ werden!</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Male, spiele Quiz oder sende uns eine Sprachnachricht!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KidsDrawingWidget />
            <KidsQuizWidget />
            <KidsVoiceMessageWidget />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-pink-50/50 via-purple-50/50 to-blue-50/50 dark:from-pink-900/10 dark:via-purple-900/10 dark:to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Was gibt es für Kinder?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Entdecke all die tollen Sachen, die wir für dich haben!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Music,
                title: "Kinderlieder",
                description: "Die schönsten Lieder zum Mitsingen und Tanzen",
                color: "text-pink-500"
              },
              {
                icon: Baby,
                title: "Geschichten",
                description: "Spannende Märchen und Abenteuer zum Träumen",
                color: "text-purple-500"
              },
              {
                icon: Gamepad2,
                title: "Spiele",
                description: "Lustige Musik-Spiele und Rätsel zum Mitmachen",
                color: "text-yellow-500"
              },
              {
                icon: Heart,
                title: "Gute-Nacht-Musik",
                description: "Sanfte Melodien für süße Träume",
                color: "text-blue-500"
              },
              {
                icon: Headphones,
                title: "Kinderradio",
                description: "Extra Programme nur für Kinder",
                color: "text-green-500"
              },
              {
                icon: Palette,
                title: "Kreativität",
                description: "Male, bastle und werde kreativ mit uns",
                color: "text-orange-500"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white/80 dark:bg-card/80 backdrop-blur-sm p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                <p className="text-foreground/70 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Für Eltern</h2>
            <div className="bg-card/60 backdrop-blur-sm p-8 rounded-xl border border-border/50">
              <p className="text-lg text-foreground/80 mb-4">
                Piper Lee Kids Radio ist speziell für Kinder entwickelt. Alle Inhalte werden sorgfältig ausgewählt und sind altersgerecht.
              </p>
              <p className="text-foreground/70 mb-6">
                Unsere Moderatoren sind geschult im Umgang mit jungen Hörern und sorgen für eine sichere, unterhaltsame Atmosphäre.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Kindgerechte Inhalte</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Pädagogisch wertvoll</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Baby className="h-5 w-5 text-pink-500" />
                  <span className="text-sm">Sicher für Kinder</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm">GEMA-abgesichert</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/kontakt">Fragen? Kontaktieren Sie uns</Link>
                </Button>
                <Button asChild className="bg-pink-500 hover:bg-pink-600 rounded-full">
                  <Link to="/sendeplan">Vollständiges Programm</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Kids;
