
import React from 'react';
import { Users, Radio, Headphones, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const StatCard = ({ title, value, icon, change, changeType = 'neutral' }: StatCardProps) => {
  const changeColorClass = 
    changeType === 'positive' ? 'text-green-600' : 
    changeType === 'negative' ? 'text-red-600' : 
    'text-gray-500';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColorClass}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-2 bg-radio-purple/10 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardStats = () => {
  // In a real app, these values would come from API calls
  const stats = [
    {
      title: "Aktive Benutzer",
      value: "248",
      icon: <Users className="h-5 w-5 text-radio-purple" />,
      change: "+12% seit letztem Monat",
      changeType: "positive" as const
    },
    {
      title: "Live-Hörer",
      value: "1,423",
      icon: <Radio className="h-5 w-5 text-radio-purple" />,
      change: "+5% seit letzter Woche",
      changeType: "positive" as const
    },
    {
      title: "Podcast Downloads",
      value: "3,782",
      icon: <Headphones className="h-5 w-5 text-radio-purple" />,
      change: "-2% seit letztem Monat",
      changeType: "negative" as const
    },
    {
      title: "Geplante Sendungen",
      value: "42",
      icon: <Calendar className="h-5 w-5 text-radio-purple" />,
      change: "Für die nächste Woche",
      changeType: "neutral" as const
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
