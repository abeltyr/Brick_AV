'use client'

import AuthenticationPage from '@/modules/account/templates/';
import { DrawerManagerProvider } from '@/lib/context/drawer/drawer';
import { AuthFlowProvider, useAuth } from '@/lib/context/auth';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { session } = useAuth()

  if (session)
    return (
      <DrawerManagerProvider>
        {children}
      </DrawerManagerProvider>
    );
  else
    return (
      <AuthFlowProvider>
        <AuthenticationPage />
      </AuthFlowProvider>
    );
}
