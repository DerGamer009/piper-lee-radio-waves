
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simple animation on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <section 
          className={`min-h-[85vh] relative flex items-center transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-radio-purple/10 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-white">Live Radio</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-radio-purple to-radio-blue">
                    Experience
                  </span>
                </h1>
                <p className="text-xl text-radio-light/80 mb-8 max-w-lg mx-auto lg:mx-0">
                  Listen to Piper Lee Radio - bringing you the best music and entertainment, streaming live 24/7.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button 
                    className="bg-radio-purple hover:bg-radio-purple/90 text-white rounded-full px-8"
                  >
                    Our Programs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-radio-blue text-radio-blue hover:bg-radio-blue/10 rounded-full px-8"
                  >
                    About Us
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center">
                <RadioPlayer streamUrl={STREAM_URL} stationName={STATION_NAME} />
              </div>
            </div>
          </div>
        </section>
        
        <section id="about" className="py-16 bg-gradient-to-b from-radio-dark to-radio-dark/90">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">About Our Station</h2>
              <p className="text-radio-light/70 max-w-2xl mx-auto">
                Piper Lee Radio is dedicated to bringing you the finest selection of music and entertainment. 
                Our station broadcasts 24/7, featuring a diverse range of genres and engaging programs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Premium Content",
                  description: "Enjoy high-quality music and shows curated by our experienced team of producers and DJs."
                },
                {
                  title: "Live Shows",
                  description: "Tune in to our exciting live broadcasts featuring special guests, interviews, and listener call-ins."
                },
                {
                  title: "Community Focus",
                  description: "We're more than just radio - we're a community of music lovers and creators sharing our passion."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-card/50 backdrop-blur-sm p-6 rounded-lg hover:transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-radio-light/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="schedule" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Program Schedule</h2>
              <p className="text-radio-light/70 max-w-2xl mx-auto">
                Check out our weekly lineup of shows and programs. There's something for everyone!
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-card rounded-lg overflow-hidden">
              {[
                { day: "Monday", show: "Morning Melodies", time: "8:00 AM - 11:00 AM" },
                { day: "Tuesday", show: "Afternoon Acoustics", time: "1:00 PM - 3:00 PM" },
                { day: "Wednesday", show: "Evening Echoes", time: "7:00 PM - 9:00 PM" },
                { day: "Thursday", show: "Late Night Lounge", time: "10:00 PM - 12:00 AM" },
                { day: "Friday", show: "Weekend Warmup", time: "6:00 PM - 8:00 PM" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 ${
                    index % 2 === 0 ? "bg-card" : "bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-radio-purple font-semibold w-24">{item.day}</div>
                    <div className="font-medium">{item.show}</div>
                  </div>
                  <div className="text-radio-light/70">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-radio-dark/80 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Radio className="h-5 w-5 text-radio-purple" />
              <p className="text-sm text-radio-light/70">
                © 2025 Piper Lee Radio. All rights reserved.
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-radio-light/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-radio-light/70 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-radio-light/70 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
