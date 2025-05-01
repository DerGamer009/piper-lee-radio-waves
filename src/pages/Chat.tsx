
import { LiveChat } from "@/components/LiveChat";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { EventsCalendar } from "@/components/EventsCalendar";

const Chat = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Live-Chat</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveChat />
        </div>
        
        <div className="space-y-6">
          <NewsletterSignup />
          <EventsCalendar />
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Community-Richtlinien</h2>
        <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg">
          <p className="text-radio-light/70 mb-4">
            Um eine freundliche und respektvolle Atmosphäre in unserem Chat zu gewährleisten, bitten wir dich, folgende Richtlinien zu beachten:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-radio-light/70">
            <li>Sei respektvoll zu anderen Chat-Teilnehmern.</li>
            <li>Keine Beleidigungen, Hassrede oder diskriminierende Äußerungen.</li>
            <li>Verzichte auf Spam und übermäßige Großschreibung.</li>
            <li>Achte auf angemessene Sprache.</li>
            <li>Teile keine persönlichen Daten anderer Personen.</li>
            <li>Moderatoren behalten sich das Recht vor, Nachrichten zu entfernen oder Nutzer zu verwarnen.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;
