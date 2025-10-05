'use client'

import { signIn, useSession } from "next-auth/react"
import { redirect, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from "react"
import { signUp } from "../actions/initDb";

export default function SignUpPage() {

    const { status } = useSession();
    const router = useRouter();

    const [email,setEmail]=useState<String>("");
    const [password,setPassword]=useState<String>("");
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("");

 
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]); 

   
    if (status === 'loading') {
       <div className="flex items-center justify-center min-h-screen bg-gray-900">
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
    
    <p className="text-xl font-semibold text-gray-300">
      Loading...
    </p>
  </div>
</div>
    }

    if(loading){
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
    
    <p className="text-xl font-semibold text-gray-300">
      Loading...
    </p>
  </div>
</div>
    }

    const handleSubmit=async (e:FormEvent)=>{
        e.preventDefault();
        setLoading(true)
        const details = await signUp(email,password)
         setEmail("");
         setPassword("")
         if(!details){
            setError("Error in Signing Up")
         }
         console.log(details);
         await signIn("credentials",{email,password,redirect:false})  
         router.push('/dashboard')
    }

    if(error.length!=0){
        return (
            <>
            {JSON.stringify(error)}
            </>
        )
    }
  
    if (status == 'unauthenticated') {
        return (
           <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            
            <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-md p-8 space-y-6 bg-gray-800/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-700"
            >
               
                <h1 className="text-3xl font-bold text-center text-white">
                    MyVault
                </h1>

               
                <div className="space-y-4">
                    <input 
                        value={email} 
                        type="email" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 text-gray-200 bg-gray-900/60 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 transition-shadow"
                        required
                    />
                    <input 
                        value={password} 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 text-gray-200 bg-gray-900/60 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 transition-shadow"
                        required
                    />
                </div>

              
                <button 
                    type="submit"
                    className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                    Sign Up
                </button>
            </form>
        </div>
        )
    }

    
    return null;
}