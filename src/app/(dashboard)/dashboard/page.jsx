import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SalesUserDashboardView from "../(sales-User)/_dashboard/SalesUserDashboardView";
import SalesManagerDashboardView from "../(Sales-Manager)/_SalesManagerDashboard/SalesManagerDashboardView";  
import FinanceAnalystDashboardView from "../(Finance Analyst )/_FinanceAnalystDashboard/FinanceAnalystDashboardView";


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
     
    case "FINANCE_ANALYST":
      return <FinanceAnalystDashboardView />;
       
   

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