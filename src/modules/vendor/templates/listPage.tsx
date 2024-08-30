'use client'

import React from 'react'
import { VendorHeader } from '../components/header'
import { VendorEmptyState } from '@/modules/empty/templates/vendor'
import { useVendors } from '@/lib/context/vendor'
import { useAuth } from '@/lib/context/auth/user'
import VendorsTableList from '../components/table'

export const VendorListTempo = () => {

    const { vendors } = useVendors()
    const { companies, companyIndex, } = useAuth();

    return (
        <main className='screen-parent'>
            <div className='min-h-[92dvh] w-full screen-padding flex flex-col gap-8 pt-10'>
                <VendorHeader />
                {/* <VendorEmptyState /> */}
                <VendorsTableList />
            </div>
        </main>
    )
}
