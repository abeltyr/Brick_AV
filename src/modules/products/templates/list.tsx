'use client'

import React, { useEffect } from 'react'
import { ProductHeader } from '../components/header'
import { ProductEmptyState } from '@/modules/empty/templates/product'
import { useProducts } from '@/lib/context/product'
import { useAuth } from '@/lib/context/auth/user'
import ProductsTableList from '../components/table'
import { Skeleton } from '@/modules/ui/skeleton'

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
