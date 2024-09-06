import React from 'react'
import * as SheetPrimitive from "@radix-ui/react-dialog"
import CloseSVG from '@/assets/icons/close'
import { Separator } from '@/modules/ui/separator'
import { LanguageTranslator } from '@/modules/language/components'


export const DrawerSheetHeader = ({ title, description }: { title: string, description?: string }) => {
    return (
        <div className='absolute w-full z-20 top-0'>
            <div className='flex justify-between p-5 px-6 items-center w-full bg-background text-foreground '>
                <div className='flex flex-col gap-1'>
                    <p className='font-black text-2xl text-foreground'>
                        <LanguageTranslator>
                            {title}
                        </LanguageTranslator>
                    </p>
                    <p className='text-tertiary text-sm font-normal max-w-[400px]'>
                        <LanguageTranslator>
                            {description}
                        </LanguageTranslator>
                    </p>
                </div>
                <SheetPrimitive.Close className="rounded-full transition-colors text-foreground/70 duration-300 hover:text-foreground">
                    <CloseSVG />
                </SheetPrimitive.Close>
            </div>
            <Separator className='m-0 p-0' />
        </div>

    )
}
