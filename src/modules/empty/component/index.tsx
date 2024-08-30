import AddSVG from '@/assets/icons/add'
import EmptyStateSVG from '@/assets/icons/empty'
import { Button } from '@/modules/ui/button'
import React from 'react'

export const EmptyState = ({ action, title, description, buttonText }: { title: string, description: string, action: Function, buttonText: string }) => {
    return (
        <div className='w-full flex flex-col gap-6 border-[1px] border-foreground/20 rounded-xl justify-center items-center min-h-[600px] flex-1'>
            <EmptyStateSVG />
            <div className='flex flex-col justify-center w-full items-center gap-2'>
                <p className='text-3xl font-black text-gray-300'>
                    {title}
                </p>
                <p className='text-lg font-light text-[#757575]'>
                    {description}
                </p>
            </div>
            <div>
                <Button className='flex gap-2 p-x4 py-2' onClick={() => {
                    action()
                }}>
                    <AddSVG />
                    {buttonText}
                </Button>
            </div>
        </div>
    )
}
