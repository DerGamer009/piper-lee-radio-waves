
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Trophy } from "lucide-react";

const KidsActivitiesWidget = () => {
  const activities = [
    {
      title: "Singzeit",
      time: "10:00 - 10:30",
      participants: 25,
      icon: "🎵",
      color: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      title: "Rätselstunde",
      time: "14:00 - 14:30", 
      participants: 18,
      icon: "🧩",
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Geschichtenzeit",
      time: "16:00 - 16:30",
      participants: 32,
      icon: "📚",
      color: "bg-blue-100 dark:bg-blue-900/30"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-rainbow-start to-rainbow-end border-rainbow-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Heute Live
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className={`p-3 rounded-lg ${activity.color} border border-white/20`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{activity.icon}</div>
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" />
                {activity.participants}
              </div>
            </div>
          </div>
        ))}
        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
          <Trophy className="h-4 w-4 mr-2" />
          Mitmachen!
        </Button>
      </CardContent>
    </Card>
  );
};

export default KidsActivitiesWidget;
