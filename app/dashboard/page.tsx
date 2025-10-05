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
        return <p>Loading...</p>;
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