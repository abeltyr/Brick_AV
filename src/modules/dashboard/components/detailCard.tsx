import { defaultDateRange, usePurchaseReport } from '@/lib/context/purchaseReport'
import { LanguageTranslator } from '@/modules/language/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card'
import { Skeleton } from '@/modules/ui/skeleton'
import { PurchaseReportType } from '@/types/report'
import { dateNameValue } from '@/types/shared'
import Decimal from 'decimal.js'
import { Activity, CreditCard, DollarSign } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const DetailCard = ({ companyId }: { companyId: string }) => {

    const { purchasesReport, dateRange, fetchPurchaseReport, loading, updateDateRange } = usePurchaseReport()

    const [purchasesReportData, setPurchasesReportData] = useState<PurchaseReportType | null>();

    useEffect(() => {
        console.log("purchasesReport, useEffect", purchasesReport, companyId, dateRange.name)
        if (purchasesReport && purchasesReport[companyId] && purchasesReport[companyId][dateRange.name]) {
            console.log("purchasesReport[companyId][dateRange.name]", purchasesReport[companyId][dateRange.name])
            setPurchasesReportData(purchasesReport[companyId][dateRange.name])
        }

    }, [companyId, dateRange.name, purchasesReport])


    useEffect(() => {
        console.log("fetching purchasesReport, useEffect")
        const fetchData = async () => {
            const localDateRange = localStorage.getItem("PurchaseDateRange")
            let dateRangeData = defaultDateRange;
            if (localDateRange) {
                const newDateRangeData = JSON.parse(localDateRange)
                if (dateRangeData.endDate && dateRangeData.startDate) {
                    const endDate = new Date(dateRangeData.endDate).getTime()
                    const startDate = new Date(dateRangeData.endDate).getTime()
                    if (
                        !isNaN(endDate) &&
                        !isNaN(startDate) &&
                        endDate > startDate &&
                        dateNameValue.includes(dateRangeData.name)
                    )
                        dateRangeData = newDateRangeData
                }
            }

            await updateDateRange({
                companyId: companyId,
                date: dateRangeData

            })
        }

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (loading)
        return (
            <div className="flex gap-4  lg:gap-8 flex-wrap min-h-[120px] ">

                <Skeleton className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit '>

                </Skeleton>
                <Skeleton className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit'>

                </Skeleton>
                <Skeleton className='flex-1'>

                </Skeleton>
            </div>
        )
    else {
        return (
            <div className="flex gap-4  lg:gap-8 flex-wrap">
                <Card x-chunk="dashboard-01-chunk-0" className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                            <LanguageTranslator>
                                Total Purchase
                            </LanguageTranslator>
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {purchasesReportData && purchasesReportData.grossAmount ? new Decimal(purchasesReportData.grossAmount).toNumber().toLocaleString('en-US') : 0}
                            {" "}
                            <LanguageTranslator>
                                Birr
                            </LanguageTranslator>

                        </div>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1" className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                            <LanguageTranslator>
                                Before</LanguageTranslator>
                            {" "}
                            <LanguageTranslator>
                                Vat
                            </LanguageTranslator>
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {purchasesReportData && purchasesReportData.totalBeforeTax ? new Decimal(purchasesReportData.totalBeforeTax).toNumber().toLocaleString('en-US') : 0}
                            {" "}
                            <LanguageTranslator>
                                Birr
                            </LanguageTranslator>
                        </div>
                    </CardContent>
                </Card>
                {purchasesReportData && purchasesReportData.vatAmount &&
                    <Card x-chunk="dashboard-01-chunk-2" className='flex-1'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium"><LanguageTranslator>
                                Vat</LanguageTranslator>
                                {" "}
                                <LanguageTranslator>
                                </LanguageTranslator></CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {purchasesReportData && purchasesReportData.vatAmount ? new Decimal(purchasesReportData.vatAmount).toNumber().toLocaleString('en-US') : 0}
                                {" "}
                                <LanguageTranslator>
                                    Birr
                                </LanguageTranslator>
                            </div>
                        </CardContent>
                    </Card>}
                {purchasesReportData && purchasesReportData.totAmount &&
                    <Card x-chunk="dashboard-01-chunk-2" className='flex-1'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium"><LanguageTranslator>
                                Tot</LanguageTranslator>
                                {" "}
                                <LanguageTranslator>
                                </LanguageTranslator></CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {purchasesReportData && purchasesReportData.totAmount ? new Decimal(purchasesReportData.totAmount).toNumber().toLocaleString('en-US') : 0}
                                {" "}
                                <LanguageTranslator>
                                    Birr
                                </LanguageTranslator>
                            </div>
                        </CardContent>
                    </Card>}
                {purchasesReportData && purchasesReportData.withholdingAmount && <Card x-chunk="dashboard-01-chunk-2" className='flex-1'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium"><LanguageTranslator>
                            Withholding </LanguageTranslator>
                            {" "}
                            <LanguageTranslator>
                            </LanguageTranslator></CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {purchasesReportData && purchasesReportData.withholdingAmount ? new Decimal(purchasesReportData.withholdingAmount).toNumber().toLocaleString('en-US') : 0}
                            {" "}
                            <LanguageTranslator>
                                Birr
                            </LanguageTranslator>
                        </div>
                    </CardContent>
                </Card>}
            </div>
        )
    }
}
