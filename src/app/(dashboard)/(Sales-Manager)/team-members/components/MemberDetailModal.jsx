"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";

export function MemberDetailModal({ userId, isOpen, onOpenChange }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchDetail();
    }
  }, [isOpen, userId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        ENDPOINTS.SALES_MANAGER.TEAM.GET_MEMBER_BY_ID(userId)
      );

      setUser(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] p-0 overflow-hidden rounded-xl bg-white shadow-lg max-h-[90vh]">

        <VisuallyHidden.Root>
          <DialogTitle>Member Profile</DialogTitle>
        </VisuallyHidden.Root>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        ) : (
          user && (
            <ScrollArea className="w-full h-full">

              <div className="flex flex-col">

                {/* Simple Header */}
                <div className="px-6 py-4 border-b bg-slate-50">

                  <h2 className="text-lg font-semibold text-slate-800">
                    {user.first_name} {user.last_name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>

                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="text-[11px] text-slate-600 border-slate-300"
                    >
                      {user.roles[0]?.role_name?.replace("_", " ")}
                    </Badge>
                  </div>

                </div>

                {/* Info Grid */}
                <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                  <DetailBox
                    icon={<Mail />}
                    label="Email"
                    value={user.email}
                  />

                  <DetailBox
                    icon={<Briefcase />}
                    label="Employee ID"
                    value={user.employee_id}
                  />

                  <DetailBox
                    icon={<MapPin />}
                    label="Region"
                    value={user.region}
                  />

                  <DetailBox
                    icon={<Calendar />}
                    label="Joined"
                    value={new Date(user.created_at).toLocaleDateString()}
                  />

                </div>

                {/* Permissions */}
                <div className="px-6 pb-8">

                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">
                      Permissions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {user.roles[0]?.permissions?.map((perm, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full"
                      >
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            </ScrollArea>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

/* Reusable Info Box */
function DetailBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white hover:shadow-sm transition">

      <div className="text-slate-600 bg-slate-100 p-2 rounded-md [&>svg]:size-4">
        {icon}
      </div>

      <div className="flex flex-col min-w-0">

        <span className="text-[10px] uppercase text-slate-400 font-medium">
          {label}
        </span>

        <span className="text-sm text-slate-800 truncate">
          {value || "Not Assigned"}
        </span>

      </div>

    </div>
  );
}