import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';
import { Button } from '@/modules/ui/button';
import { CirclePlus, Eye } from 'lucide-react';
import { useAuth } from '@/lib/context/auth/user';
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
import Decimal from 'decimal.js';
import { Badge } from '@/modules/ui/badge';


export const PurchaseOverview = ({ companyId }: { companyId: string }) => {

    const { getPurchase, loadMoreData, fetchingPurchases, fetchPurchases, purchases } = usePurchases();
    const { currentCompany } = useAuth();


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
                    <Button className="ml-auto gap-2 "
                        variant={"secondary"}
                    >
                        <Eye className='w-4 h-4' />
                        View All
                    </Button>
                    <Button className="ml-auto gap-2 text-white">
                        <CirclePlus className='w-4 h-4' />
                        Add Purchase
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid gap-8" >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Purchase Date</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Before Vat</TableHead>
                            <TableHead className="table-cell text-center">Vat Amount</TableHead>
                            <TableHead className="table-cell text-center">grossAmount</TableHead>
                            <TableHead className="hidden md:table-cell text-center">nonTaxableAmount</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Inventory</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases[companyId] && purchases[companyId].slice(0, 20).map((purchase, index) => {
                            let companyName = "---";
                            let tinNumber = "---";
                            let beforeVat = new Decimal(0);
                            if (purchase &&
                                purchase.vendor &&
                                purchase.vendor.profile &&
                                purchase.vendor.profile.companyName) {
                                companyName = purchase.vendor.profile.companyName;
                            }
                            else if (purchase &&
                                purchase.vendor &&
                                purchase.vendor.profile &&
                                purchase.vendor.profile.name) {
                                companyName = purchase.vendor.profile.name;
                            }

                            if (purchase &&
                                purchase.vendor &&
                                purchase.vendor.profile &&
                                purchase.vendor.profile.tinNumber)
                                tinNumber = purchase.vendor.profile.tinNumber


                            if (purchase &&
                                purchase.taxableAmount) {
                                if (purchase.nonTaxableAmount) {
                                    beforeVat = new Decimal(purchase.taxableAmount).plus(purchase.nonTaxableAmount)
                                } else {

                                    beforeVat = new Decimal(purchase.taxableAmount)
                                }

                            }


                            return <TableRow
                                key={index}
                                className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">

                                    </div>
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
                                                    tinNumber
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
                                    {`${beforeVat}`}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase && purchase.totalVat ? `${purchase.totalVat}` : "---"}
                                </TableCell>
                                <TableCell className="table-cell text-center">
                                    {purchase && purchase.grossAmount ? `${purchase.grossAmount}` : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    <Badge>
                                        {purchase && purchase.productType ? `${purchase.productType}` : "---"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center ">
                                    {purchase && purchase.purchaseType ? `${purchase.purchaseType}` : "---"}
                                </TableCell>

                            </TableRow>
                        })}
                    </TableBody>
                </Table>

            </CardContent>
        </Card >
    )
}
