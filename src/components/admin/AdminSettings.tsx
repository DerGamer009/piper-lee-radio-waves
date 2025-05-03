
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

const AdminSettings = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        <p className="text-muted-foreground">
          This is the admin settings page. You can manage system settings here.
        </p>
      </div>
    </SidebarInset>
  );
};

export default AdminSettings;
