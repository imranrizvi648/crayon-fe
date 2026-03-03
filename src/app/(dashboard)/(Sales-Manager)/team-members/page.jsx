"use client";
import React from 'react';
import { useState } from 'react';
import { useTeamMembers } from "./_hook/useTeamMembers";
import { TeamMemberCard } from "./components/TeamMemberCard";
import { AddMemberModal } from "./components/AddMemberModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function TeamPage() {
  const { members, loading, filters, updateFilter,createMember } = useTeamMembers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="bg-[#f8fafc] min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black  text-gray-700 ">
            Team Member
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Review and manage costing sheets across your region
          </p>
        </div>

          {/* Postman style filters integration */}
       <div className="flex w-full md:w-auto gap-3 items-center">

  {/* Search */}
  <div className="relative w-full md:w-64">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

    <Input
      placeholder="Search by name..."
      className="pl-10 bg-white border-slate-200"
      value={filters.search}
      onChange={(e) =>
        updateFilter({ search: e.target.value, skip: 0 })
      }
    />
  </div>

  {/* Add Member Button */}
 <Button
          className="bg-primary text-primary-foreground font-semibold px-4 whitespace-nowrap"
          onClick={() => setIsAddModalOpen(true)} // Open modal here
        >
          + Add Member
        </Button>

</div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((user) => (
                <TeamMemberCard key={user.id} member={user} />
              ))}
            </div>

            <AddMemberModal 
          isOpen={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen} 
          onCreate={createMember} 
        />

            {members.length === 0 && (
              <div className="text-center py-20 text-slate-400 font-medium">
                No team members found for "{filters.search}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}