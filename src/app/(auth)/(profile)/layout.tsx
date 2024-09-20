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


  const { session } = useAuth()


  const { profile, fetchProfile, loading } = useProfile()

  // useEffect(() => {
  //   if (session && session.user && session.user.id)
  //     fetchProfile(session?.user.id)

  // }, [fetchProfile, session])


  if (loading && !profile) return <LoadingTemplate />



  console.log("profile", profile);

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
