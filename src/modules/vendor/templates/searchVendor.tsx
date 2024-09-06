"use client"

import AddSVG from '@/assets/icons/add'
import { useState } from 'react'
import { DrawerSheetHeader } from '@/modules/common/components/drawer/header'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { useDrawerManager } from '@/lib/context/drawer/drawer'


export const SearchVendorSection = () => {

    const { setAddVendorDrawer } = useDrawerManager();
    const [isLoading, setIsLoading] = useState<boolean>(false)


    return (
        <div className='w-full h-full overflow-y-auto'>
            <DrawerSheetHeader title={"Vendors Listing"} />
            <div className='h-20' />
            <DrawerSheetFooter
                isLoading={isLoading}
                createSVG={<AddSVG />}
            />
        </div>


    )
}
