// components/dashboard/study-reminder.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StudyReminderProps {
  userName: string;
}

export function StudyReminder({ userName }: StudyReminderProps) {
  // Initialize with empty strings instead of Date values
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  
  // Move all Date operations to useEffect so they only run client-side
  useEffect(() => {
    // Set initial values
    updateGreeting();
    updateTime();
    updateDate();
    
    // Update time every minute
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  function updateGreeting() {
    const hour = new Date().getHours();
    let newGreeting = "";
    
    if (hour < 12) {
      newGreeting = "Good morning";
    } else if (hour < 18) {
      newGreeting = "Good afternoon";
    } else {
      newGreeting = "Good evening";
    }
    
    setGreeting(newGreeting);
  }
  
  function updateTime() {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }
  
  function updateDate() {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Study Reminder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-medium">{greeting}, {userName}!</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{currentTime}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="mb-4">Ready to continue your EASA Part 66 preparation?</p>
            <Link href="/study">
              <Button className="w-full">
                Start Studying
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}