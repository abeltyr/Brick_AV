'use client'

import React, { useEffect, useState, } from 'react'
import { VendorHeader } from '../components/header'
import { VendorEmptyState } from '@/modules/empty/templates/vendor'
import { useVendors } from '@/lib/context/vendor'
import { useAuth } from '@/lib/context/auth/user'
import VendorsTableList from '../components/table'
import { Skeleton } from '@/modules/ui/skeleton'

export const VendorListTempo = () => {

    const { vendors, getVendor, initialLoading } = useVendors()
    const { currentCompany } = useAuth();


    useEffect(() => {
        if (currentCompany) {
            if (!vendors[currentCompany.companyId])
                getVendor({ companyId: currentCompany.companyId })
        }
    }, [currentCompany, getVendor, vendors])


    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <VendorHeader />
                {initialLoading ?
                    <div className='w-full h-full'>
                        <Skeleton className='w-full h-[12.5%] rounded-md' />
                        <div className='w-full py-1' />
                        <Skeleton className='w-full h-[80%] rounded-md' />
                    </div> :
                    currentCompany &&
                        vendors &&
                        vendors[currentCompany.companyId] &&
                        vendors[currentCompany.companyId].length > 0 ?
                        <VendorsTableList vendors={vendors[currentCompany.companyId]} /> :
                        <VendorEmptyState />

                }
            </div>
        </main>
    )
}
