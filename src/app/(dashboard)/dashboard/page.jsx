import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SalesUserDashboardView from "../(sales-User)/_dashboard/SalesUserDashboardView";
import SalesManagerDashboardView from "../(Sales-Manager)/_SalesManagerDashboard/SalesManagerDashboardView";  


export default async function DashboardPage({ params }) {

  const resolvedParams = await params; 

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  let userRole = "";
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf-8"));
    userRole = payload?.roles?.[0]?.toUpperCase();
  } catch (e) {
    redirect("/login");
  }

  // 2️⃣ Role-Based Switching Logic

  switch (userRole) {
    case "SALES_USER":
      return <SalesUserDashboardView />;
    
    case "SALES_MANAGER":
      return <SalesManagerDashboardView />;
      // return (
      //   <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100">
      //      <h2 className="text-xl font-bold text-slate-800">Sales Manager Dashboard</h2>
      //      <p className="text-slate-500">View is being developed...</p>
      //   </div>
      // );

    case "ADMIN":
      return (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-red-600">Admin Panel</h2>
           <p className="text-slate-500">System analytics coming soon.</p>
        </div>
      );

    case "FINANCE_ANALYST":
      return (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-blue-600">Finance Overview</h2>
           <p className="text-slate-500">Financial reports will be displayed here.</p>
        </div>
      );

    // Baqi 3 roles: OPERATIONS_MANAGER, SALES_LEAD, EXECUTIVE
    case "OPERATIONS_MANAGER":
      return <div className="p-6">Operations Dashboard</div>;

    case "SALES_LEAD":
      return <div className="p-6">Sales Lead View</div>;

    case "EXECUTIVE":
      return <div className="p-6">Executive Summary</div>;
    
    default:
      // if role mismatch or unrecognized, redirect to unauthorized page
      redirect("/unauthorized");
  }
}