'use client'

import AddSVG from '@/assets/icons/add'
import { HeaderTextComponent } from '@/modules/common/components/headerText'
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import React from 'react'
import { AddVendorSection } from '../templates/add'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { useVendors } from '@/lib/context/vendor'



export const VendorHeader = () => {

    const { addVendorDrawer, setAddVendorDrawer } = useDrawerManager()
    const { setBusiness } = useVendors();

    return (
        <section className='w-full flex justify-between items-center'>
            <HeaderTextComponent title='Vendor' description='Description text of Vendor.' />
            <Sheet
                open={addVendorDrawer}
                onOpenChange={setAddVendorDrawer}
                modal={addVendorDrawer}
            >
                <SheetTrigger asChild>
                    <Button className='flex gap-2 p-x4 py-2'
                        onClick={() => {
                            setBusiness(null)
                        }}
                    >
                        <AddSVG />
                        <LanguageTranslator>
                            Add Vendor
                        </LanguageTranslator>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="max-w-[400px] min-w-[800px] p-0 flex flex-col h-full ">
                    <AddVendorSection />
                </SheetContent>
            </Sheet>

        </section>
    )
}
