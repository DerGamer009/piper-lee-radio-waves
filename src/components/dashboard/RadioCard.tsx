
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

export const RadioCard = () => {
  const [radioStatus, setRadioStatus] = useState<string>("online");
  const { toast } = useToast();

  const handleStatusChange = (value: string) => {
    setRadioStatus(value);
    
    // Show toast notification on status change
    const statusMessages = {
      online: "Radio ist jetzt online",
      maintenance: "Wartungsmodus aktiviert",
      offline: "Radio ist jetzt offline"
    };
    
    toast({
      title: "Status geändert",
      description: statusMessages[value as keyof typeof statusMessages],
    });
  };

  return (
    <Card className="bg-[#1A1F2C] border-gray-700">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-white">Radio Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup 
          value={radioStatus} 
          onValueChange={handleStatusChange}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="online" id="online" className="border-purple-400 text-purple-400" />
            <Label htmlFor="online" className="text-green-400 font-medium">Online</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="maintenance" id="maintenance" className="border-purple-400 text-purple-400" />
            <Label htmlFor="maintenance" className="text-amber-400 font-medium">Maintenance Mode</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="offline" id="offline" className="border-purple-400 text-purple-400" />
            <Label htmlFor="offline" className="text-red-400 font-medium">Offline</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default RadioCard;
