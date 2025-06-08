
import { Clock, Baby, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KidsScheduleWidget = () => {
  const schedule = [
    { time: "06:00", show: "Guten Morgen Kinder", host: "DJ Sonne" },
    { time: "09:00", show: "Kinderlieder Mix", host: "DJ Luna" },
    { time: "12:00", show: "Mittagspause", host: "DJ Regenbogen" },
    { time: "15:00", show: "Geschichtenstunde", host: "DJ Märchen" },
    { time: "18:00", show: "Gute Nacht Musik", host: "DJ Stern" },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Heute bei Kids Radio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 w-12">
              {item.time}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.show}</p>
              <p className="text-xs text-muted-foreground">mit {item.host}</p>
            </div>
            <Baby className="h-4 w-4 text-pink-500" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KidsScheduleWidget;
