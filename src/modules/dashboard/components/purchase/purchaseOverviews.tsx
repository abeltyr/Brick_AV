import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';

import { Avatar, AvatarFallback } from '@/modules/ui/avatar';
import { Button } from '@/modules/ui/button';
import { Eye } from 'lucide-react';
import { usePurchases } from '@/lib/context/purchase';
import { LanguageTranslator } from '@/modules/language/components';
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


export const PurchaseOverview = ({ companyId }: { companyId: string }) => {

    const { purchases } = usePurchases();



    return (
        <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader className="flex flex-row items-center justify-between gap-6">
                <div className="grid gap-2">
                    <CardTitle>
                        <LanguageTranslator>
                            Purchases
                        </LanguageTranslator>
                    </CardTitle>
                    <CardDescription>
                        <LanguageTranslator>
                            {"Here's a list of your recent Purchases for this month!"}
                        </LanguageTranslator>
                    </CardDescription>
                </div>
                <div className='flex gap-2'>

                    <Link href="/purchases">
                        <Button className="ml-auto gap-2 "
                            variant={"secondary"}
                        >
                            <Eye className='w-4 h-4' />
                            View All
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="grid gap-8" >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Date</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Purchase Date</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Before Vat</TableHead>
                            <TableHead className="table-cell text-center">Vat</TableHead>
                            <TableHead className="table-cell text-center">Withholding</TableHead>
                            <TableHead className="table-cell text-center">grossAmount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases[companyId] && purchases[companyId].slice(0, 10).map((purchase, index) => {
                            let companyName = "---";
                            let tin = "---";

                            if (purchase &&
                                purchase.vendor &&
                                purchase.vendor.name) {
                                companyName = purchase.vendor.name;
                            }

                            if (purchase &&
                                purchase.vendor &&
                                purchase.vendor.business &&
                                purchase.vendor.business.tin)
                                tin = purchase.vendor.business.tin




                            return <TableRow
                                key={index}
                                className="bg-accent">
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="hidden h-9 w-9 sm:flex bg-primary text-white">
                                            <AvatarFallback className='bg-primary text-white'>{companyName.slice(0, 1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {companyName
                                                }
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    tin
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center ">
                                    {purchase && purchase.createdAt ? `${purchase.createdAt.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}` : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    <Badge>
                                        {purchase && purchase.productType ? `${purchase.productType}` : "---"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center ">
                                    {purchase && purchase.purchaseType ? `${purchase.purchaseType}` : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase && purchase.totalAmount ? `${purchase.totalAmount}` : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase && purchase.taxAmount ? `${purchase.taxAmount}` : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase && purchase.withholdingAmount ? `${purchase.withholdingAmount}` : "---"}
                                </TableCell>
                                <TableCell className="table-cell text-center">
                                    {purchase && purchase.grossAmount ? `${purchase.grossAmount}` : "---"}
                                </TableCell>


                            </TableRow>
                        })}
                    </TableBody>
                </Table>

            </CardContent>
        </Card >
    )
}
