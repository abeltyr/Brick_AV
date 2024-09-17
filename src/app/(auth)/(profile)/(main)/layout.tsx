'use client'

import { NavBar } from '@/modules/layout/components/nav';
import { useCompany } from '@/lib/context/account';
import { useEffect } from 'react';
import { useAuth } from '@/lib/context/auth';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const { session } = useAuth()
  const { fetchCompanies } = useCompany()

  useEffect(() => {
    if (session && session.user && session.user.id)
      fetchCompanies({ userId: session?.user.id, refetch: false })
  }, [fetchCompanies, session])


  return (
    <div className='flex'>
      <main className='flex-1 '>
        <NavBar />
        <div className='min-h-14 h-[8vh] max-h-20' />
        {children}
      </main>
    </div>
  );
}
