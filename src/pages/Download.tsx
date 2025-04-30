
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download as DownloadIcon, ExternalLink, ChevronDown, Share2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const Download = () => {
  const { toast } = useToast();
  
  // Direct link to the APK file - we can update this URL
  const apkDownloadUrl = "https://backend.piper-lee.net/download/piper-lee-radio-app.apk";
  
  const handleDownload = () => {
    toast({
      title: "Download gestartet",
      description: "Die APK-Datei wird heruntergeladen. Bitte folge den Anweisungen zur Installation.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-radio-light hover:text-white">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Piper Lee Radio App</h1>
        <p className="text-radio-light/70 max-w-2xl mx-auto">
          Lade unsere Android-App herunter und genieße dein Lieblings-Radio überall.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 max-w-lg w-full mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-radio-purple p-3 rounded-full">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Piper Lee Radio</h2>
              <p className="text-radio-light/70 text-sm">Version 1.0.0</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="flex items-center justify-center gap-2 bg-radio-purple hover:bg-radio-purple/90 text-white py-6"
              onClick={handleDownload}
            >
              <DownloadIcon className="h-5 w-5" />
              <a 
                href={apkDownloadUrl}
                download="piper-lee-radio-app.apk"
                className="flex-1"
                type="application/vnd.android.package-archive"
              >
                Android APK herunterladen
              </a>
            </Button>
            
            <Button variant="outline" className="border-radio-light/20">
              <Share2 className="h-4 w-4 mr-2" />
              Teilen
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-lg">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="install" className="border-radio-light/20">
              <AccordionTrigger className="text-left py-4 hover:no-underline">
                <span>Installationsanleitung</span>
              </AccordionTrigger>
              <AccordionContent className="text-radio-light/70">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Lade die APK-Datei herunter</li>
                  <li>Öffne die Datei auf deinem Android-Gerät</li>
                  <li>Wenn eine Sicherheitswarnung erscheint, erlaube die Installation aus unbekannten Quellen</li>
                  <li>Folge den Anweisungen zur Installation</li>
                  <li>Öffne die App nach erfolgreicher Installation</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="requirements" className="border-radio-light/20">
              <AccordionTrigger className="text-left py-4 hover:no-underline">
                <span>Systemanforderungen</span>
              </AccordionTrigger>
              <AccordionContent className="text-radio-light/70">
                <ul className="list-disc list-inside space-y-2">
                  <li>Android 6.0 oder höher</li>
                  <li>Mindestens 50 MB freier Speicherplatz</li>
                  <li>Internetverbindung für Streaming</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="features" className="border-radio-light/20">
              <AccordionTrigger className="text-left py-4 hover:no-underline">
                <span>Features</span>
              </AccordionTrigger>
              <AccordionContent className="text-radio-light/70">
                <ul className="list-disc list-inside space-y-2">
                  <li>Live-Radio-Streaming</li>
                  <li>Podcast-Archiv</li>
                  <li>Sendeplan</li>
                  <li>Benachrichtigungen für Lieblingssendungen</li>
                  <li>Musik im Hintergrund abspielen</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Download;
