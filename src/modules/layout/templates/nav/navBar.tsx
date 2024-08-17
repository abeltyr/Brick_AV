import React from 'react'

import { Button } from '@/modules/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu"
import Image from "next/image"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/modules/ui/breadcrumb"
import Link from 'next/link';
import { Input } from "@/modules/ui/input"
import { Search } from 'lucide-react';
import { AvatarSection, SearchBlock } from '@/modules/layout/components';
import TeamSwitcher from '../../components/team';
import { MainNav } from './nav';



export const NavBar = () => {
    return (
        <header className="border-b 
        sticky top-0 z-30
        hidden sm:flex justify-between items-center 
        w-full h-14 
        gap-4 
        sm:sticky bg-background sm:h-auto sm:border-b-[1px] px-6 py-3">
            <div className='flex gap-6 '>
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
    )
}
