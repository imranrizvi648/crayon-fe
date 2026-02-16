'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Agar user authenticated hai toh role ke mutabiq redirect karein
    if (isAuthenticated && user) {
      const userRole = (user?.roles && user.roles.length > 0) 
        ? user.roles[0].toUpperCase() 
        : 'SALES_USER';

      console.log("Root Page Redirecting for Role:", userRole);

      // Role-based redirection logic
      if (userRole === 'ADMIN') {
        router.replace('/dashboard/analytics'); // Admin ka pehla page
      } else if (userRole === 'SALES_USER') {
        router.replace('/dashboard'); // Sales ka pehla page
      } else {
        // Default fallback agar koi role match na ho
        router.replace('/dashboard/profile');
      }
    }
  }, [isAuthenticated, user, router]);

  // Jab tak redirect nahi hota, tab tak loading ya blank screen dikhayein
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-[#1a364d] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}

export default Page;