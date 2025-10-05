'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GenPassword } from "../components/genPasword";
import { ShowVaults } from "../components/showVaults";

export default function(){
 const {status} = useSession();
 const router = useRouter();

useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]); 

    if (status === 'loading') {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-sm">
            
          
            <div className="relative flex items-center justify-center w-20 h-20">

              
                <div className="absolute w-full h-full border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                
           
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="absolute w-8 h-8 text-gray-400"
                >
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3.5 8H6.5V5.5a3.5 3.5 0 117 0V9z" clipRule="evenodd" />
                </svg>

            </div>

           
            <p className="mt-4 text-lg font-medium text-gray-300">
                Securing...
            </p>
        </div>
    );
}


if(status=="authenticated"){
    return(
       <div className="h-screen bg-gray-900 text-white font-sans overflow-hidden">
            <div className="flex h-full">

                {/* Left Column: Password Generator (Fixed) */}
                <div className="md:w-1/3 lg:w-1/3 p-4 sm:p-6 border-r border-gray-800">
                    <GenPassword />
                </div>

                {/* Right Column: All Vaults (Scrollable) */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <ShowVaults />
                </div>

            </div>
        </div>
    )
}
}