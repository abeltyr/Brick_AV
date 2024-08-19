'use client'

import React from 'react'

import { Button } from "@/modules/ui/button"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';
import { useAuth } from '@/lib/context/auth/user';
import Link from 'next/link';
import { Settings, User } from 'lucide-react';

export const AvatarSection = () => {

    const { session, logout } = useAuth();

    return (
        // <DropdownMenu>
        //     <DropdownMenuTrigger asChild>

        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="end" className='min-w-[220px]'>
        //         <DropdownMenuLabel>My Account</DropdownMenuLabel>
        //         <DropdownMenuSeparator />
        //         <DropdownMenuItem>Settings</DropdownMenuItem>
        //         <DropdownMenuItem>Support</DropdownMenuItem>
        //         <DropdownMenuSeparator />
        //         <DropdownMenuItem onClick={() => {
        //             logout();
        //         }}>Logout</DropdownMenuItem>
        //     </DropdownMenuContent>
        // </DropdownMenu>


        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/images/placeholder-user.webp" alt="Avatar" />
                        <AvatarFallback>{session && session.user &&
                            session.user.identities &&
                            session.user.identities.length > 0 &&
                            session.user.identities[0].identity_data &&
                            `${session.user.identities[0].identity_data.name}`.slice(0, 1).toUpperCase() + `${session.user.identities[0].identity_data.name}`.slice(1, 2)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-80 2xsm:w-72 md:w-60 mt-2 md:-mr-2 rounded-xl text-foreground" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none capitalize">{
                            session && session.user &&
                            session.user.identities &&
                            session.user.identities.length > 0 &&
                            session.user.identities[0].identity_data && session.user.identities[0].identity_data.name}</p>
                        <p className="text-xs leading-none text-neutral-400">
                            {session && session.user &&
                                session.user.identities &&
                                session.user.identities.length > 0 &&
                                session.user.identities[0].identity_data && session.user.identities[0].identity_data.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/settings">
                        <DropdownMenuItem className='cursor-pointer text-sm font-medium text-foreground py-2 flex gap-x-2'>
                            <Settings className='w-4 h-4' />
                            Settings
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/company">
                        <DropdownMenuItem className='cursor-pointer text-sm font-medium text-foreground py-2 flex gap-x-2'>
                            <User className='w-4 h-4' />
                            company
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => {
                    logout();
                }}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
