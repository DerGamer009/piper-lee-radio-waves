
import { ArrowLeft, Mail, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-radio-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-radio-light hover:text-white">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto bg-card/20 backdrop-blur-sm p-8 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-8 w-8 text-radio-blue" />
            <h1 className="text-3xl font-bold">Kontakt</h1>
          </div>
          
          <div className="mb-8 text-radio-light/80">
            <p>Haben Sie Fragen, Anregungen oder Wünsche? Nutzen Sie unser Kontaktformular oder kontaktieren Sie uns direkt.</p>
            
            <div className="mt-4 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-lg font-medium mb-2 text-white">Unsere Adresse</h3>
                <p>Piper Lee Radio GmbH</p>
                <p>Radiostraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
                
                <h3 className="text-lg font-medium mt-4 mb-2 text-white">Kontaktdaten</h3>
                <p>Telefon: +49 30 1234567</p>
                <p>E-Mail: info@piper-lee.net</p>
                
                <div className="mt-6 flex items-center gap-2">
                  <Radio className="h-5 w-5 text-radio-purple" />
                  <span className="font-medium">Piper Lee Radio - Musik & Unterhaltung</span>
                </div>
              </div>
              
              <div className="md:w-1/2">
                {isSubmitted ? (
                  <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-green-500/50">
                    <h3 className="text-lg font-medium mb-2 text-white">Nachricht gesendet!</h3>
                    <p>Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      className="mt-4 bg-radio-purple hover:bg-radio-purple/90"
                    >
                      Neue Nachricht senden
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-card/30 border-radio-light/20 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-card/30 border-radio-light/20 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Betreff</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-card/30 border-radio-light/20 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Nachricht</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full rounded-md border border-radio-light/20 bg-card/30 px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm mt-1"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-radio-purple hover:bg-radio-purple/90 w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Wird gesendet...
                        </>
                      ) : (
                        "Nachricht senden"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
