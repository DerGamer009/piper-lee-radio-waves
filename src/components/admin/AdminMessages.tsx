
import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

const AdminMessages = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Messages</h1>
        <p className="text-muted-foreground">
          This is the admin messages page. You can manage system messages here.
        </p>
      </div>
    </SidebarInset>
  );
};

export default AdminMessages;
