'use client'

import AuthenticationPage from '@/modules/auth/templates/';
import { AuthFlowProvider, useAuth } from '@/lib/context/auth';
import { CompanyProvider, useProfile } from '@/lib/context/account';
import { useEffect } from 'react';
import { ChartOfAccountProvider } from '@/lib/context/account/chartOfAccount';


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { session } = useAuth()

  const { fetchProfile } = useProfile()

  useEffect(() => {
    console.log("fetchProfile,session, useEffect")
    if (session && session.user && session.user.id) {
      fetchProfile(session.user.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (session)
    return (
      <CompanyProvider>
        <ChartOfAccountProvider>
          {children}
        </ChartOfAccountProvider>
      </CompanyProvider>
    );
  else
    return (
      <AuthFlowProvider>
        <AuthenticationPage />
      </AuthFlowProvider>
    );
}
