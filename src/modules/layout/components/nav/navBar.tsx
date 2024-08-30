import React from 'react'

import { AvatarSection } from '@/modules/layout/components';
import TeamSwitcher from '../../components/team';
import { MainNav } from './nav';
import LogoSVG from '@/assets/icons/logo';



export const NavBar = () => {
    return (
        <div className='screen-parent min-h-14 h-[8vh] max-h-20 fixed z-30'>
            <header className="border-b 
         top-0 
        flex justify-between items-center 
        w-full 
        gap-4 
        sm:sticky bg-background sm:h-auto sm:border-b-[1px] py-3 screen-padding">
                <div className='flex gap-6 '>
                    <LogoSVG />
                    <TeamSwitcher />
                    <MainNav />
                </div>
                {/*
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div> */}
                {/* <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="#">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="#">Orders</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb> */}
                {/* <SearchBlock /> */}
                <AvatarSection />


            </header>
        </div>
    )
}
