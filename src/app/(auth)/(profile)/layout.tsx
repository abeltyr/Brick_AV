'use client'

import AuthenticationPage from '@/modules/auth/templates/';
import { AuthFlowProvider, useAuth } from '@/lib/context/auth';
import { CompanyProvider, ProfileProvider, useProfile } from '@/lib/context/account';
import { DrawerManagerProvider } from '@/lib/context/drawer/drawer';
import { useEffect } from 'react';
import LoadingTemplate from '@/modules/common/templates/loading';
import OnboardingPage from '@/modules/account/templates/onboarding';
import { OnboardingProvider } from '@/lib/context/account/onboarding';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  const { profile, fetchProfile, loading } = useProfile()


  if (loading && !profile)
    return (
      <>
        <p className='text-3xl font-black text-black'>
          Profile Loading
        </p>
        <LoadingTemplate />
      </>)


  if (profile && profile.CompanyMember && profile.CompanyMember.length > 0)
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
