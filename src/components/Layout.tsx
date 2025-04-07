
import { ReactNode } from "react";
import Header from "./Header";
import RadioPlayer from "./RadioPlayer";
import { useLocation } from "react-router-dom";

// Constants for radio stream
const STREAM_URL = "https://backend.piper-lee.net/listen/piper-lee/radio.mp3";
const STATION_NAME = "Piper Lee Radio";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <div className="flex flex-col min-h-screen bg-radio-dark text-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
      
      {!isHomePage && (
        <div className="fixed bottom-6 right-6 z-40">
          <RadioPlayer 
            streamUrl={STREAM_URL} 
            stationName={STATION_NAME} 
          />
        </div>
      )}
    </div>
  );
};

export default Layout;
