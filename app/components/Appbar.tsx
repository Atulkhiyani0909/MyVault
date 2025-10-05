'use client'
import { signIn,signOut, useSession } from "next-auth/react";
import Link from "next/link";

function AppBar() {
    const session = useSession();
    const user = session?.data?.user

return (
  <header className="w-full bg-gray-800 shadow fixed top-0 left-0 z-50">
    <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
     
      <div className="text-2xl font-bold text-blue-600">
       <Link href="/dashboard" className="font-semibold text-blue-400 hover:underline">
                           MyVault
                       </Link>
      </div>

     
      <div>
       <button
          onClick={() => (user ? signOut() : signIn())}
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  </header>
);


   
}

export default AppBar
