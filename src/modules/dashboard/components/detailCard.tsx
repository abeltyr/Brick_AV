import { usePurchases } from '@/lib/context/purchase'
import { LanguageTranslator } from '@/modules/language/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card'
import { Skeleton } from '@/modules/ui/skeleton'
import { PurchaseReportType } from '@/types/purchase'
import Decimal from 'decimal.js'
import { Activity, CreditCard, DollarSign } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const DetailCard = ({ companyId }: { companyId: string }) => {

    const { purchasesReport, fetchingPurchaseReport, year, month } = usePurchases()

    const [purchasesReportData, setPurchasesReportData] = useState<PurchaseReportType | null>();

    useEffect(() => {
        const data = purchasesReport[`${companyId}_${year}_${month}`];
        if (data && data.length > 0) {
            setPurchasesReportData(data[0])
        }

        return () => {
        }
    }, [companyId, month, purchasesReport, year])


    if (fetchingPurchaseReport)
        return (
            <div className="flex gap-4  lg:gap-8 flex-wrap">
                <Skeleton className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit min-h-[120px]'>

                </Skeleton>
                <Skeleton className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit'>

                </Skeleton>
                <Skeleton className='flex-1'>

                </Skeleton>
            </div>
        )
    else if (purchasesReportData) {
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
                            {/* <LanguageTranslator>
                                ETB
                            </LanguageTranslator> */}
                            {/* {" "} */}
                            {new Decimal(purchasesReportData.grossAmount).toNumber().toLocaleString('en-US')}
                            {" "}
                            <LanguageTranslator>
                                Birr
                            </LanguageTranslator>

                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +20.1% {" "}
                            <LanguageTranslator>
                                from last month
                            </LanguageTranslator>
                        </p> */}
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
                            {new Decimal(purchasesReportData.taxableAmount).plus(new Decimal(purchasesReportData.nonTaxableAmount)).toNumber().toLocaleString('en-US')}
                            {" "}
                            <LanguageTranslator>
                                Birr
                            </LanguageTranslator>
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +180.1% {" "}
                            <LanguageTranslator>
                                from last month
                            </LanguageTranslator>
                        </p> */}
                    </CardContent>
                </Card>
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
                            {new Decimal(purchasesReportData.totalVat).toNumber().toLocaleString('en-US')}
                            {" "}
                            <LanguageTranslator>
                                Birr
                            </LanguageTranslator>
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            +19% {" "}
                            <LanguageTranslator>
                                from last month
                            </LanguageTranslator>
                        </p> */}
                    </CardContent>
                </Card>
            </div>
        )
    }
}
