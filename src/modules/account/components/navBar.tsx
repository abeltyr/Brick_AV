import React from 'react'

import { AvatarSection } from '@/modules/layout/components';
import LogoSVG from '@/assets/icons/logo';



export const OnboardingNavBar = () => {
    return (
        <div className='screen-parent min-h-14 h-[8vh] max-h-20 fixed z-30'>
            <header
                className="border-b top-0 flex justify-between items-center w-full gap-4 sm:sticky bg-background sm:h-auto sm:border-b-[1px] py-3 screen-padding">
                <LogoSVG />
                <AvatarSection />
            </header>
        </div>
    )
}
