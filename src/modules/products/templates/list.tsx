'use client'

import React, { useEffect } from 'react'
import { ProductHeader } from '../components/header'
import { ProductEmptyState } from '@/modules/empty/templates/product'
import { useProducts } from '@/lib/context/product'
import ProductsTableList from '../components/table'
import { Skeleton } from '@/modules/ui/skeleton'
import { CalendarDateRangePicker } from '@/modules/common/components/dateRange'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select'
import { useCompany } from '@/lib/context/account'

export const ProductListTempo = () => {

    const { products, getProduct, loading } = useProducts()
    const { currentCompany } = useCompany();


    useEffect(() => {
        if (currentCompany) {
            if (!products[currentCompany.companyId])
                getProduct({ companyId: currentCompany.companyId })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCompany])


    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <ProductHeader />

                <div className='flex gap-4'>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Time Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Weekly">Last 7 days</SelectItem>
                            <SelectItem value="Bi-Weekly">Last 2 days</SelectItem>
                            <SelectItem value="Monthly">Last Month</SelectItem>
                            <SelectItem value="Quarterly">Last 4 months</SelectItem>
                            <SelectItem value="Yearly">Last 12 months</SelectItem>
                            <SelectItem value="Custom Range">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>

                    <CalendarDateRangePicker />
                </div>

                {loading ?
                    <div className='w-full h-full'>
                        <Skeleton className='w-full h-[12.5%] rounded-md' />
                        <div className='w-full py-1' />
                        <Skeleton className='w-full h-[80%] rounded-md' />
                    </div> :
                    currentCompany &&
                        products &&
                        products[currentCompany.companyId] &&
                        products[currentCompany.companyId].length > 0 ?
                        <ProductsTableList companyId={currentCompany.companyId} /> :
                        <ProductEmptyState />
                }
            </div>
        </main>
    )
}
