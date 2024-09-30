import { useCompany } from '@/lib/context/account';
import { useExportPurchase } from '@/lib/context/purchaseExport';
import { LanguageTranslator } from '@/modules/language/components';
import { Button } from '@/modules/ui/button';
import { ArrowUpRightIcon, CirclePlus } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export const DashboardNav = () => {
    const { fetchPurchaseCSV } = useExportPurchase();
    const { currentCompany } = useCompany();

    return (
        <div className="flex items-center justify-between space-y-2">
            <div className='flex flex-col gap-3'>
                <h2 className="text-3xl font-bold tracking-tight">
                    <LanguageTranslator>

                        {/* This Months Purchases */}
                        Bills & Report
                    </LanguageTranslator>
                </h2>
                <p className="text-sm font-extralight tracking-tight">
                    Overview of charges, payments, and detailed insights for this month.
                </p>
            </div>
            <div className="flex items-center space-x-2">
                {/* <CalendarDateRangePicker /> */}
                <Button
                    variant={"secondary"}
                    className='text-foreground gap-1 flex items-center'
                    onClick={() => {
                        // if (currentCompany)
                        //     fetchPurchaseCSV({
                        //         companyId: currentCompany.companyId,
                        //         year: 2016,
                        //         month: 12,
                        //     })
                    }}>
                    <ArrowUpRightIcon className='w-4 h-4 text-foreground ' />
                    Export CSV
                </Button>

                <Link
                    href={"/purchases/add"}
                    prefetch
                ><Button className="ml-auto gap-2 text-white">
                        <CirclePlus className='w-4 h-4' />
                        Add Purchase
                    </Button>
                </Link>
            </div>
        </div>
    )
}
