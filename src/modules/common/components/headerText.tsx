import { LanguageTranslator } from '@/modules/language/components'
import React from 'react'

export const HeaderTextComponent = ({ description, title }: { title: string, description: string }) => {
    return (
        <div className='flex flex-col gap-2'>
            <p className='font-black text-3xl text-foreground'>
                <LanguageTranslator>

                    {title}
                </LanguageTranslator>
            </p>
            <p className='text-tertiary text-lg font-normal'>
                <LanguageTranslator>
                    {description}
                </LanguageTranslator>
            </p>
        </div>
    )
}
