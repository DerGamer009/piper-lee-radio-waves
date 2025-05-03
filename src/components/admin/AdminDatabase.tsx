
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

const AdminDatabase = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Database</h1>
        <p className="text-muted-foreground">
          This is the admin database page. You can manage system database here.
        </p>
      </div>
    </SidebarInset>
  );
};

export default AdminDatabase;
