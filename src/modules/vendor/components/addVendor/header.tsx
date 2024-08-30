import React from 'react'
import * as SheetPrimitive from "@radix-ui/react-dialog"
import CloseSVG from '@/assets/icons/close'
import { Separator } from '@/modules/ui/separator'
import { LanguageTranslator } from '@/modules/language/components'


export const AddVendorHeader = () => {
    return (
        <div className='absolute w-full z-20 top-0'>
            <div className='flex justify-between p-6 items-center w-full bg-background text-foreground '>
                <p className='text-2xl font-black '>
                    <LanguageTranslator>
                        Add Vendor
                    </LanguageTranslator>
                </p>
                <SheetPrimitive.Close className="rounded-full transition-colors text-foreground/70 duration-300 hover:text-foreground">
                    <CloseSVG />
                </SheetPrimitive.Close>
            </div>
            <Separator className='m-0 p-0' />
        </div>

    )
}
