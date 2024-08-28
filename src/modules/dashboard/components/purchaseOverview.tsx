import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';
import { Button } from '@/modules/ui/button';
import { ArrowUpRight, Link } from 'lucide-react';


export const PurchaseOverview = () => {
    return (
        <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Year </CardTitle>
                    <CardDescription>
                        cumulated Data
                    </CardDescription>
                </div>
                <Button className="ml-auto gap-1 text-black">
                    2016
                </Button>
            </CardHeader>
            T
            <CardContent className="grid gap-8">
                <div className="flex items-center gap-4">

                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Nehase
                        </p>
                        <p className="text-sm text-muted-foreground">
                            0092181112
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+ETB 1,999.00</div>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/02.png" alt="Avatar" />
                        <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Jackson Lee
                        </p>
                        <p className="text-sm text-muted-foreground">
                            0092181112
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+ETB 39.00</div>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/03.png" alt="Avatar" />
                        <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Isabella Nguyen
                        </p>
                        <p className="text-sm text-muted-foreground">
                            0092181112
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+ETB 299.00</div>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            William Kim
                        </p>
                        <p className="text-sm text-muted-foreground">
                            0092181112
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+ETB 99.00</div>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/05.png" alt="Avatar" />
                        <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Sofia Davis
                        </p>
                        <p className="text-sm text-muted-foreground">
                            0092181112
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+ETB 39.00</div>
                </div>
            </CardContent>
        </Card>
    )
}
