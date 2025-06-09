
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsWidget = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Maria Schmidt",
      text: "Piper Lee Radio begleitet mich jeden Tag. Die Musik ist perfekt und die Moderatoren sind einfach toll!",
      rating: 5,
      location: "München"
    },
    {
      name: "Thomas Weber",
      text: "Endlich ein Radiosender, der wirklich versteht, was gute Musik bedeutet. Höre seit Jahren täglich!",
      rating: 5,
      location: "Berlin"
    },
    {
      name: "Lisa Müller",
      text: "Die Kids-Sendungen sind fantastisch! Meine Kinder lieben es und ich kann beruhigt mithören.",
      rating: 5,
      location: "Hamburg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[currentTestimonial];

  return (
    <Card className="bg-gradient-to-br from-radio-purple/5 to-radio-blue/5 border-radio-purple/20">
      <CardContent className="p-6">
        <div className="text-center">
          <Quote className="h-8 w-8 text-radio-purple mx-auto mb-4 opacity-50" />
          <p className="text-lg italic mb-4 text-foreground/80">"{testimonial.text}"</p>
          
          <div className="flex justify-center mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-foreground/60">{testimonial.location}</p>
        </div>
        
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTestimonial ? 'bg-radio-purple' : 'bg-radio-purple/30'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsWidget;
