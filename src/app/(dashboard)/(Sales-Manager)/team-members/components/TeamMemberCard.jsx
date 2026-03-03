import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MemberDetailModal } from "./MemberDetailModal";
import { Clock } from "lucide-react"; // Icon ke liye

export function TeamMemberCard({ member }) {
  const [showDetail, setShowDetail] = useState(false);
  
  const initials = member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
  const targetValue = 3000000; 
  const progressPercentage = (member.total_value / targetValue) * 100;

  // Time calculation logic
  const formatLastActive = (dateStr) => {
    if (!dateStr || dateStr === "Never logged in") return "Never logged in";
    
    const now = new Date();
    const lastActive = new Date(dateStr);
    const diffInSeconds = Math.floor((now - lastActive) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <>
      <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <Avatar className="h-12 w-12 shadow-sm overflow-hidden">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center w-full h-full">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-foreground text-lg leading-tight tracking-tight">{member.name}</h3>
                <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
              </div>
            </div>
            <Badge className="bg-accent text-accent-foreground border-none px-2.5 py-0.5 text-[11px] font-bold">
              {member.status}
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Region & Last Active Section */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground font-medium">Region:</span>
                <span className="font-bold text-foreground">{member.region}</span>
              </div>
              
              {/* LAST ACTIVE ADDED HERE */}
              <div className="flex justify-between text-[11px] items-center text-muted-foreground">
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <Clock className="h-3 w-3" /> Last Active:
                </span>
                <span className="font-bold text-slate-500">
                  {formatLastActive(member.last_active)}
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm font-bold text-foreground mb-1.5">Target Progress</p>
              <Progress value={progressPercentage} className="h-2 bg-muted rounded-full" />
              <div className="flex justify-between text-[10px] mt-1.5 text-muted-foreground font-bold tracking-wider uppercase">
                <span>{`$${(member.total_value / 1000).toFixed(0)}K`}</span>
                <span>$3000K</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-border">
               <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Sheets</p>
                  <p className="text-base font-extrabold text-foreground">{member.sheets}</p>
               </div>
               <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Approval</p>
                  <p className="text-base font-bold text-foreground">{member.approval_rate}%</p>
               </div>
               <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Value</p>
                  <p className="text-base font-bold text-foreground">{`$${(member.total_value / 1000).toFixed(0)}K`}</p>
               </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="grid grid-cols-2 gap-3 pb-6 px-6">
          <Button 
            variant="outline" 
            onClick={() => setShowDetail(true)}
            className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 font-bold"
          >
            View Profile
          </Button>
          <Button variant="outline" className="text-foreground border-border bg-background hover:bg-muted font-bold">
            Message
          </Button>
        </CardFooter>
      </Card>

      {showDetail && (
        <MemberDetailModal
          userId={member.id}
          isOpen={showDetail}
          onOpenChange={setShowDetail}
        />
      )}
    </>
  );
}