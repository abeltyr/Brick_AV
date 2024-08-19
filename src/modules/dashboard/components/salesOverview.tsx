import React from 'react'

import { Button } from '@/modules/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/modules/ui/table"
import { Badge } from '@/modules/ui/badge';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';


export const SalesOverview = () => {
    return (
        <Card x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Sales</CardTitle>
                    <CardDescription>
                        Recent sales from your store.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden xl:table-column">
                                Type
                            </TableHead>
                            <TableHead className="hidden xl:table-column">
                                Status
                            </TableHead>
                            <TableHead className="hidden xl:table-column">
                                Date
                            </TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Johnson LLC</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    0091121212
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                Sale
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell xl:table-column">
                                2023-06-23
                            </TableCell>
                            <TableCell className="text-right">ETB 250.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Pola LLC</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    0091121212
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                Refund
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Declined
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-24
                            </TableCell>
                            <TableCell className="text-right">ETB 150.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Williams PLC</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    00941221212
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                Subscription
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-25
                            </TableCell>
                            <TableCell className="text-right">ETB 350.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Brown PLC</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    0092181112
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                Sale
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-26
                            </TableCell>
                            <TableCell className="text-right">ETB 450.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="font-medium">Johnson PLC</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    00129101112
                                </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                Sale
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                    Approved
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                2023-06-27
                            </TableCell>
                            <TableCell className="text-right">ETB 550.00</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
