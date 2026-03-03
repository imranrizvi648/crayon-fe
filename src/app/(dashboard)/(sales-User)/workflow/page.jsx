"use client";
import { useWorkflow } from "./hooks/useWorkflow";
import WorkflowSidebar from "./components/WorkflowSidebar";
import WorkflowDetail from "./components/WorkflowDetail";
import { LayoutDashboard } from "lucide-react"; // 1. Icon import kiya

export default function WorkflowPage() {
  const { sheets, selectedId, setSelectedId, workflowData, loading, workflowLoading } = useWorkflow();

  if (loading) return <div className="p-10 text-center font-semibold">Loading Sheets...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50 px-3 overflow-hidden text-black">
      
      {/* Header Section - Isko main container ke andar rakha */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
        
          <div>
               <h1 className="text-2xl font-black  text-gray-700 ">
              Workflow
            </h1>
             <p className="text-muted-foreground text-sm font-medium mt-1">
              Manage and review your workflow sheets in one place
            </p>
          </div>
        </div>
      </div>

      {/* Content Section - Sidebar aur Detail ko flex container mein dala */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        <WorkflowSidebar 
          sheets={sheets} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
        
        <WorkflowDetail 
          workflowData={workflowData} 
          selectedSheetInfo={sheets.find(s => s.id === selectedId)} 
          isLoading={workflowLoading} 
        />
      </div>
    </div>
  );
}