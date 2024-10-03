'use client'

import React, { useEffect } from 'react'
import { PurchaseHeader } from '../components/header'
import { PurchaseEmptyState } from '@/modules/empty/templates/purchase'
import { usePurchases } from '@/lib/context/purchase'
import PurchasesTableList from '../components/table'
import { Skeleton } from '@/modules/ui/skeleton'
import { useCompany } from '@/lib/context/account'

export const PurchaseListTempo = () => {

    const { purchases, getPurchase, isLoading, loading } = usePurchases()
    const { currentCompany } = useCompany();


    useEffect(() => {

        console.log("currentCompany, purchases, PurchaseListTempo")

        if (currentCompany) {
            if (!purchases[currentCompany.companyId])
                getPurchase({ companyId: currentCompany.companyId })
        }
    }, [currentCompany, purchases])


    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <PurchaseHeader />

                {loading ?
                    <div className='w-full h-full'>
                        <Skeleton className='w-full h-[12.5%] rounded-md' />
                        <div className='w-full py-1' />
                        <Skeleton className='w-full h-[80%] rounded-md' />
                    </div> :
                    currentCompany &&
                        purchases &&
                        purchases[currentCompany.companyId] &&
                        purchases[currentCompany.companyId].length > 0 ?
                        <PurchasesTableList companyId={currentCompany.companyId} /> :
                        <PurchaseEmptyState />
                }
            </div>
        </main>
    )
}
