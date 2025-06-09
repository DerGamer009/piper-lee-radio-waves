
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Radio, Clock, Heart } from "lucide-react";

const StatsWidget = () => {
  const stats = [
    {
      icon: Users,
      value: "125.000+",
      label: "Aktive Hörer",
      color: "text-blue-500"
    },
    {
      icon: Radio,
      value: "24/7",
      label: "Live on Air",
      color: "text-green-500"
    },
    {
      icon: Clock,
      value: "168",
      label: "Stunden pro Woche",
      color: "text-purple-500"
    },
    {
      icon: Heart,
      value: "99.2%",
      label: "Zufriedenheit",
      color: "text-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-foreground/70">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsWidget;
