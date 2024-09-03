'use client'

import { DashboardNav } from '@/modules/dashboard/components/nav';
import { DetailCard } from '@/modules/dashboard/components/detailCard';
import { PurchaseEmptyState } from '@/modules/empty/templates/purchase';
import { useAuth } from '@/lib/context/auth/user';
import { usePurchases } from '@/lib/context/purchase';
import { useEffect } from 'react';
import { Skeleton } from '@/modules/ui/skeleton';
import { PurchaseOverview } from '../components/purchaseOverviews';

export default function DashboardTemplate() {

    const { purchases, getPurchase, initialLoading } = usePurchases()
    const { currentCompany } = useAuth();


    useEffect(() => {
        if (currentCompany) {
            if (!purchases[currentCompany.companyId])
                getPurchase({ companyId: currentCompany.companyId })
        }
    }, [currentCompany, getPurchase, purchases])

    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <DashboardNav />
                <DetailCard />
                {initialLoading ?
                    <div className='w-full h-full'>
                        <Skeleton className='w-full h-[12.5%] rounded-md' />
                        <div className='w-full py-1' />
                        <Skeleton className='w-full h-[80%] rounded-md' />
                    </div> :
                    currentCompany &&
                        purchases &&
                        purchases[currentCompany.companyId] &&
                        purchases[currentCompany.companyId].length > 0 ?
                        <PurchaseOverview companyId={currentCompany.companyId} /> :
                        <PurchaseEmptyState />
                }

            </div>
        </main>
    );
}



{/* <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"> */ }
{/* <div className="xl:col-span-2">
    <SalesOverview />
    <PurchaseSection />
</div>
<PurchaseOverview /> */}

// </div>