'use client'

import { DashboardNav } from '@/modules/dashboard/components/nav';
import { DetailCard } from '@/modules/dashboard/components/detailCard';
import { PurchaseEmptyState } from '@/modules/empty/templates/purchase';
import { usePurchases } from '@/lib/context/purchase';
import { useEffect } from 'react';
import { Skeleton } from '@/modules/ui/skeleton';
import { PurchaseOverview } from '../components/purchaseOverviews';
import { defaultDateRange, usePurchaseReport } from '@/lib/context/purchaseReport';
import { useCompany } from '@/lib/context/account';
import { dateNameValue } from '@/types/shared';


export default function DashboardTemplate() {

    const { currentCompany } = useCompany()

    // useEffect(() => {
    //     if (currentCompany) {
    //         if (!purchases[currentCompany.companyId]) {

    //             const georgiaYear = new Date();
    //             const ethiopiaYear = toEthiopian({
    //                 date: 1,
    //                 month: georgiaYear.getMonth() + 1,
    //                 year: georgiaYear.getFullYear()
    //             });

    //             let monthData = month;
    //             let yearData = year;
    //             if (ethiopiaYear) {
    //                 monthData = ethiopiaYear?.month;
    //                 yearData = ethiopiaYear?.year;
    //             } {
    //                 getPurchase({ companyId: currentCompany.companyId, monthData, yearData })
    //                 getPurchaseReport({ companyId: currentCompany.companyId, monthData, yearData })
    //             }
    //         }
    //     }
    // }, [currentCompany, getPurchase, getPurchaseReport, month, purchases, year])

    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <DashboardNav />
                {currentCompany && <DetailCard companyId={currentCompany.companyId} />}
                {/* {initialLoading ?
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
                } */}
            </div>
        </main>
    );
}
