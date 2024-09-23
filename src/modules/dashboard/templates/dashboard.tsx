'use client'

import { DashboardNav } from '@/modules/dashboard/components/nav';
import { DetailCard } from '@/modules/dashboard/components/detailCard';
import { PurchaseEmptyState } from '@/modules/empty/templates/purchase';
import { usePurchases } from '@/lib/context/purchase';
import { useEffect } from 'react';
import { Skeleton } from '@/modules/ui/skeleton';
import { PurchaseOverview } from '../components/purchase/purchaseOverviews';
import { defaultDateRange, usePurchaseReport } from '@/lib/context/purchaseReport';
import { useCompany } from '@/lib/context/account';
import { dateNameValue } from '@/types/shared';
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
