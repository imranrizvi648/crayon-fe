"use client";
import { useWorkflow } from "./hooks/useWorkflow";
import WorkflowSidebar from "./components/WorkflowSidebar";
import WorkflowDetail from "./components/WorkflowDetail";

export default function WorkflowPage() {
  const { sheets, selectedId, setSelectedId, workflowData, loading, workflowLoading } = useWorkflow();

  if (loading) return <div className="p-10 text-center font-semibold">Loading Sheets...</div>;

  const selectedSheetInfo = sheets.find(s => s.id === selectedId);

  return (
    <div className="flex h-screen bg-gray-50 p-6 gap-6 overflow-hidden text-black">
      <WorkflowSidebar 
        sheets={sheets} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />
      
      <WorkflowDetail 
        workflowData={workflowData} 
        selectedSheetInfo={selectedSheetInfo} 
        isLoading={workflowLoading} 
      />
    </div>
  );
}