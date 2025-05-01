
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SongRequestForm } from "@/components/SongRequestForm";
import { SongHistory } from "@/components/SongHistory";

const SongRequests = () => {
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Song-Wünsche</h1>
        
        <div className="flex mb-6">
          <Button
            variant={activeTab === 'request' ? 'default' : 'outline'}
            onClick={() => setActiveTab('request')}
            className={`flex-1 rounded-r-none ${
              activeTab === 'request' ? 'bg-radio-purple hover:bg-radio-purple/90' : ''
            }`}
          >
            Song wünschen
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className={`flex-1 rounded-l-none ${
              activeTab === 'history' ? 'bg-radio-purple hover:bg-radio-purple/90' : ''
            }`}
          >
            Zuletzt gespielt
          </Button>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg">
          {activeTab === 'request' ? (
            <div>
              <p className="text-radio-light/70 mb-6">
                Fehlt dir ein bestimmter Song im Programm? Hier kannst du deinen Musikwunsch einreichen.
                Unser DJ-Team wird versuchen, deinen Wunsch so bald wie möglich ins Programm zu nehmen.
              </p>
              <SongRequestForm />
            </div>
          ) : (
            <div>
              <p className="text-radio-light/70 mb-6">
                Hier siehst du die zuletzt gespielten Songs in unserem Radioprogramm.
                Falls du einen verpasst hast, findest du ihn hier.
              </p>
              <SongHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongRequests;
