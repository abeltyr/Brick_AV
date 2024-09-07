"use client"

import { useState } from "react"
import { VendorDrawerTable } from './listing'
import { DrawerAddVendorSection } from './add'
import { VendorType } from '@/types/vendor'


export const VendorListing = ({ updateVendor }: { updateVendor: (vendor: VendorType) => void }) => {


    const [isAddingVendor, setIsAddingVendor] = useState(false)

    return (
        <div className="h-full relative pt-28 overflow-hidden ">
            {isAddingVendor ?
                <DrawerAddVendorSection
                    setIsAddingVendor={(value: boolean) => {
                        setIsAddingVendor(value)
                    }}
                    updateVendor={updateVendor}
                />
                :
                <VendorDrawerTable
                    setIsAddingVendor={setIsAddingVendor}
                    updateVendor={updateVendor}
                />
            }


        </div>
    )
}