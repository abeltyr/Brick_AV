'use client'

import { DashboardNav } from '@/modules/dashboard/components/nav';
import { DetailCard } from '@/modules/dashboard/components/detailCard';
import { useCompany } from '@/lib/context/account';
import { OverViewPurchaseSection } from '../components/purchase';


export default function DashboardTemplate() {

    const { currentCompany } = useCompany()

    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <DashboardNav />
                {currentCompany && <DetailCard companyId={currentCompany.companyId} />}
                {currentCompany && <OverViewPurchaseSection companyId={currentCompany.companyId} />}
            </div>
        </main>
    );
}
