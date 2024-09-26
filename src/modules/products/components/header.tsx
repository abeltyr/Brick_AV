'use client'

import AddSVG from '@/assets/icons/add'
import { HeaderTextComponent } from '@/modules/common/components/headerText'
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import React from 'react'
import { AddProductSection } from '../templates/add'
import { useDrawerManager } from '@/lib/context/drawer/drawer'



export const ProductHeader = () => {

    const { addProductDrawer, setAddProductDrawer } = useDrawerManager()
    return (
        <section className='w-full flex justify-between items-center'>
            <HeaderTextComponent title='Product' description='Description text of Product.' />
            <Sheet
                open={addProductDrawer}
                onOpenChange={setAddProductDrawer}
                modal={addProductDrawer}
            >
                <SheetTrigger asChild>
                    <Button className='flex gap-2 p-x4 py-2'
                        onClick={() => { }}
                    >
                        <AddSVG />
                        <LanguageTranslator>
                            Add Product
                        </LanguageTranslator>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="max-w-[400px] w-[50%] min-w-[600px] p-0 flex flex-col h-full ">
                    <AddProductSection />
                </SheetContent>
            </Sheet>

        </section>
    )
}
