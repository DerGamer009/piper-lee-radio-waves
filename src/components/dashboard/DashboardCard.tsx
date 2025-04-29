
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
  className,
  actionButton,
  headerClassName
}: DashboardCardProps) => {
  return (
    <Card className={`${className} transition-all hover:shadow-md`}>
      <CardHeader className={`pb-2 flex flex-row items-center justify-between ${headerClassName}`}>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {icon}
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
