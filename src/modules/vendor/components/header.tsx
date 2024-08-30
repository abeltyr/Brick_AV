'use client'

import AddSVG from '@/assets/icons/add'
import { HeaderTextComponent } from '@/modules/common/components/headerText'
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import React from 'react'

export const VendorHeader = () => {
    return (
        <section className='w-full flex justify-between items-center'>
            <HeaderTextComponent title='Vendor' description='Description text of Vendor.' />
            <Button className='flex gap-2 p-x4 py-2'
                onClick={() => {

                }}
            >
                <AddSVG />
                <LanguageTranslator>
                    Add Vendor
                </LanguageTranslator>
            </Button>
        </section>
    )
}
