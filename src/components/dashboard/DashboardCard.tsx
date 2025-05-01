
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  actionButton?: ReactNode;
  headerClassName?: string;
}

const DashboardCard = ({ 
  title, 
  icon, 
  children, 
  className = '',
  actionButton,
  headerClassName = ''
}: DashboardCardProps) => {
  return (
    <Card className={`bg-gradient-to-br from-[#1c1f2f] to-[#252a40] border-gray-800/50 shadow-md transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className={`pb-2 flex flex-row items-center justify-between ${headerClassName}`}>
        <CardTitle className="text-base md:text-lg font-medium flex items-center gap-2 text-gray-200">
          <div className="p-1.5 rounded-full bg-[#7c4dff]/20">
            {icon}
          </div>
          {title}
        </CardTitle>
        {actionButton && (
          <div className="flex items-center">
            {actionButton}
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
