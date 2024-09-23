import { useCompany } from '@/lib/context/account'
import { usePurchases } from '@/lib/context/purchase'
import { PurchaseEmptyState } from '@/modules/empty/templates/purchase'
import { Skeleton } from '@/modules/ui/skeleton'
import React, { useEffect } from 'react'
import { PurchaseOverview } from './purchaseOverviews'

export const OverViewPurchaseSection = ({ companyId }: { companyId: string }) => {

  const { loading, purchases, getPurchase, error } = usePurchases()

  useEffect(() => {
    console.log("purchase overview useEffect")
    getPurchase({ companyId: companyId })


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  if (loading)
    return <div className='w-full h-full'>
      <Skeleton className='w-full h-[12.5%] rounded-md' />
      <div className='w-full py-1' />
      <Skeleton className='w-full h-[80%] rounded-md' />
    </div>
  else if (!loading && error)
    return <div className='w-full h-full'>
      Purchase Error Page
      <div className='w-full py-1' />
      <Skeleton className='w-full h-[80%] rounded-md' />
    </div>
  else if (purchases &&
    purchases[companyId]) {
    if (purchases[companyId].length > 0)
      return <PurchaseOverview companyId={companyId} />
    else
      return <PurchaseEmptyState />
  }



}
