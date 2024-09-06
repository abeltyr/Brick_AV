"use client"

import { DrawerSheetHeader } from '@/modules/common/components/drawer/header'
import { VendorListing } from '../components/search'
import { VendorType } from '@/types/vendor'


export const SearchVendorSection = ({ updateVendor }: { updateVendor: (vendor: VendorType) => void }) => {

    return (
        <div className='w-full h-full overflow-y-hidden'>
            <DrawerSheetHeader title={"Vendors"} description='Search the vendor this purchase is made from. if it is a new vendor you can create it here.' />
            <div className='flex-1 relative w-full h-full overflow-hidden'>
                <VendorListing updateVendor={updateVendor} />
            </div>
        </div>
    )
}
