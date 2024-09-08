'use client'

import React, { useEffect } from 'react'
import { ProductHeader } from '../components/header'
import { ProductEmptyState } from '@/modules/empty/templates/product'
import { useProducts } from '@/lib/context/product'
import { useAuth } from '@/lib/context/auth/user'
import ProductsTableList from '../components/table'
import { Skeleton } from '@/modules/ui/skeleton'
import { CalendarDateRangePicker } from '@/modules/common/components/dateRange'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select'

export const ProductListTempo = () => {

    const { products, getProduct, initialLoading } = useProducts()
    const { currentCompany } = useAuth();


    useEffect(() => {
        if (currentCompany) {
            if (!products[currentCompany.companyId])
                getProduct({ companyId: currentCompany.companyId })
        }
    }, [currentCompany, getProduct, products])


    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <ProductHeader />

                <div className='flex gap-4'>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="last7days">Last 7 days</SelectItem>
                            <SelectItem value="last4weeks">Last 4 weeks</SelectItem>
                            <SelectItem value="last3months">Last 3 months</SelectItem>
                            <SelectItem value="last12months">Last 12 months</SelectItem>
                            <SelectItem value="monthtodate">Month to date</SelectItem>
                            <SelectItem value="quartertodate">Quarter to date</SelectItem>
                            <SelectItem value="yeartodate">Year to date</SelectItem>
                            <SelectItem value="alltime">All time</SelectItem>
                        </SelectContent>
                    </Select>

                    <CalendarDateRangePicker />
                </div>

                {initialLoading ?
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
