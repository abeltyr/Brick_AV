import { useAuth } from '@/lib/context/auth/user';
import { useExportPurchase } from '@/lib/context/purchaseExport';
import { CalendarDateRangePicker } from '@/modules/common/components/dateRange';
import { LanguageTranslator } from '@/modules/language/components';
import { Button } from '@/modules/ui/button';
import React from 'react'

export const DashboardNav = () => {
    const { fetchPurchaseCSV } = useExportPurchase();
    const { currentCompany } = useAuth();

    return (
        <div className="flex items-center justify-between space-y-2">
            <div className='flex flex-col gap-3'>
                <h2 className="text-3xl font-bold tracking-tight">
                    <LanguageTranslator>
                        Bills & Report
                    </LanguageTranslator>
                </h2>
                <p className="text-sm font-extralight tracking-tight">
                    Overview of charges, payments, and detailed insights.
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button onClick={() => {
                    console.log("currentCompany", currentCompany)
                    if (currentCompany)
                        fetchPurchaseCSV({
                            companyId: currentCompany.companyId,
                            year: 2016,
                            month: 12,
                        })
                }}>Export</Button>
            </div>
        </div>
    )
}
