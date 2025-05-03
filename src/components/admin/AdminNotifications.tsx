
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

const AdminNotifications = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Notifications</h1>
        <p className="text-muted-foreground">
          This is the admin notifications page. You can manage system notifications here.
        </p>
      </div>
    </SidebarInset>
  );
};

export default AdminNotifications;
