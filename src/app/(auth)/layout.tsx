'use client'

import AuthenticationPage from '@/modules/auth/templates/';
import { AuthFlowProvider, useAuth } from '@/lib/context/auth';
import { CompanyProvider, useProfile } from '@/lib/context/account';
import { useEffect } from 'react';


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { session } = useAuth()

  const { fetchProfile } = useProfile()

  useEffect(() => {
    if (session && session.user && session.user.id) {
      fetchProfile(session?.user.id)
    }

  }, [fetchProfile, session])


  if (session)
    return (
      <CompanyProvider>
        {children}
      </CompanyProvider>
    );
  else
    return (
      <AuthFlowProvider>
        <AuthenticationPage />
      </AuthFlowProvider>
    );
}
