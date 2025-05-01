
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const RadioCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Radio Status</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="online" className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online" className="text-green-600 font-medium">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maintenance" id="maintenance" />
            <Label htmlFor="maintenance" className="text-amber-600 font-medium">Maintenance Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline" className="text-red-600 font-medium">Offline</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default RadioCard;
