
import AddSVG from '@/assets/icons/add'
import { HeaderTextComponent } from '@/modules/common/components/headerText'
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import React from 'react'
import { AddPurchaseSection } from '../templates/add'
import Link from 'next/link'



export const PurchaseHeader = () => {
    return (
        <section className='w-full flex justify-between items-center'>
            <HeaderTextComponent title='Purchase' description='Description text of Purchase.' />
            <Link href={"/purchases/add"}>
                <Button className='flex gap-2 p-x4 py-2'>
                    <AddSVG />
                    <LanguageTranslator>
                        Add Purchase
                    </LanguageTranslator>
                </Button>

            </Link>
        </section>
    )
}
