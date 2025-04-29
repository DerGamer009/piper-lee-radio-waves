
import React from 'react';
import { Users, Radio, Headphones, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  bgColor?: string;
  textColor?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  bgColor = 'bg-white',
  textColor = 'text-radio-purple'
}: StatCardProps) => {
  const changeColorClass = 
    changeType === 'positive' ? 'text-green-600' : 
    changeType === 'negative' ? 'text-red-600' : 
    'text-gray-500';

  const changeIcon = 
    changeType === 'positive' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
    changeType === 'negative' ? <TrendingDown className="h-3 w-3 mr-1" /> : 
    null;

  return (
    <div className={`${bgColor} rounded-lg shadow p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColorClass} flex items-center`}>
              {changeIcon}
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
      changeType: "positive" as const,
      bgColor: "bg-gradient-to-br from-white to-purple-50",
    },
    {
      title: "Live-Hörer",
      value: "1,423",
      icon: <Radio className="h-5 w-5 text-radio-purple" />,
      change: "+5% seit letzter Woche",
      changeType: "positive" as const,
      bgColor: "bg-gradient-to-br from-white to-blue-50",
    },
    {
      title: "Podcast Downloads",
      value: "3,782",
      icon: <Headphones className="h-5 w-5 text-radio-purple" />,
      change: "-2% seit letztem Monat",
      changeType: "negative" as const,
      bgColor: "bg-gradient-to-br from-white to-orange-50",
    },
    {
      title: "Geplante Sendungen",
      value: "42",
      icon: <Calendar className="h-5 w-5 text-radio-purple" />,
      change: "Für die nächste Woche",
      changeType: "neutral" as const,
      bgColor: "bg-gradient-to-br from-white to-green-50",
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
