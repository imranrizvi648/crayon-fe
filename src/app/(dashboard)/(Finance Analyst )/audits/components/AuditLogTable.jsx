"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Monitor, User, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";

export function AuditLogTable({ logs, loading }) {
  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Logs...</div>;

  return (
    <div className="bg-white rounded-md border shadow-sm overflow-hidden p-3">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="text-[12px] !font-bold uppercase">
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead>User / IP</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity Type</TableHead>
            <TableHead>Entity ID/UUID</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-slate-400" />
                  {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <User size={12}/> {log.username || "System/Guest"}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Monitor size={10}/> {log.ip_address}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-secondary lowercase border-blue-200 text-[12px]">
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="text-[14px] font-semibold lowercase text-slate-600">
                {log.entity_type}
              </TableCell>
              <TableCell className="max-w-[150px]">
                <div className="flex flex-col gap-0.5">
                   <span className="text-[12px] font-mono text-slate-500">ID: {log.entity_id}</span>
                   {log.entity_uuid && (
                     <span className="text-[9px] text-slate-400 truncate" title={log.entity_uuid}>
                       UUID: {log.entity_uuid}
                     </span>
                   )}
                </div>
              </TableCell>
              <TableCell className="text-center">
               <Badge
  className={
    log.status === "SUCCESS"
      ? "bg-secondary/10 text-green-600 border-green-200 lowercase"
      : "bg-red-500/10 text-red-600 border-red-200 lowercase"
  }
>
  {log.status?.toLowerCase()}
</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}