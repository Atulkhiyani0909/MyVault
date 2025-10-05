'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const session  = useSession();
  const router = useRouter();
  if(session?.data?.user){
    return router.push('/dashboard')
  }else{
    return router.push('/signin');
  }
  return (
    <>
   
    </>
  );
}
