'use client'

import AuthenticationPage from '@/modules/auth/templates/';
import { AuthFlowProvider, useAuth } from '@/lib/context/auth';
import { CompanyProvider, ProfileProvider, useProfile } from '@/lib/context/account';
import { DrawerManagerProvider } from '@/lib/context/drawer/drawer';
import { useEffect } from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const { session } = useAuth()


  const { profile, fetchProfile } = useProfile()

  useEffect(() => {
    if (session && session.user && session.user.id)
      fetchProfile(session?.user.id)

  }, [fetchProfile, session])

  if (profile)
    return (
      <DrawerManagerProvider>
        {children}
      </DrawerManagerProvider>
    );
  else
    return (
      <div>
        No Profile
      </div>
    );
}
