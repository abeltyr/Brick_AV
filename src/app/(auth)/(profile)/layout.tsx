'use client'


import { useCompany, useProfile } from '@/lib/context/account';
import { DrawerManagerProvider } from '@/lib/context/drawer/drawer';
import { useEffect } from 'react';
import LoadingTemplate from '@/modules/common/templates/loading';
import OnboardingPage from '@/modules/account/templates/onboarding';
import { OnboardingProvider } from '@/lib/context/account/onboarding';
import { useChartOfAccount } from '@/lib/context/account/chartOfAccount';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  const { profile, loading, error } = useProfile()


  if (loading && !profile)
    return (
      <>
        <p className='text-3xl font-black text-black'>
          Profile Loading
        </p>
        <LoadingTemplate />
      </>)
  else if (!loading && !profile && error)
    return <>
      <p className='text-3xl font-black text-black'>
        Profile Error Page
      </p>
      <LoadingTemplate />
    </>
  else if (profile && profile.CompanyMember && profile.CompanyMember.length > 0)
    return (
      <DrawerManagerProvider>
        {children}
      </DrawerManagerProvider>
    );
  else
    return (
      <OnboardingProvider>
        <OnboardingPage />
      </OnboardingProvider>
    );
}
