
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

const AdminUsers = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Users</h1>
        <p className="text-muted-foreground">
          This is the admin users page. You can manage system users here.
        </p>
      </div>
    </SidebarInset>
  );
};

export default AdminUsers;
