'use client'

import React from 'react'
import { ProductHeader } from '../components/header'
import { ProductEmptyState } from '@/modules/empty/templates/product'
import { useProducts } from '@/lib/context/product'
import { useAuth } from '@/lib/context/auth/user'
import ProductsTableList from '../components/table'

export const ProductListTempo = () => {

    const { products } = useProducts()
    const { companies, companyIndex, } = useAuth();

    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <ProductHeader />
                {/* <ProductEmptyState /> */}
                <ProductsTableList />
            </div>
        </main>
    )
}
