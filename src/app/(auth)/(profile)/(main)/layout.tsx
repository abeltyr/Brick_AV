'use client'

import { NavBar } from '@/modules/layout/components/nav';
import { useCompany, useProfile } from '@/lib/context/account';
import { useEffect } from 'react';
import LoadingTemplate from '@/modules/common/templates/loading';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const { profile } = useProfile()
  const { fetchCompanies, companies, loading } = useCompany()

  useEffect(() => {
    console.log("Company useEffect session")
    if (profile && profile.id)
      fetchCompanies({ userId: profile.id, refetch: false })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  if (loading && !companies)
    return (
      <>
        <p className='text-3xl font-black text-black'>
          Company Loading
        </p>
        <LoadingTemplate />
      </>)


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
