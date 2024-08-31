"use client"

import AddSVG from '@/assets/icons/add'
import LoadingSVG from '@/assets/icons/loading'
import { useAuth } from '@/lib/context/auth/user'
import { usePurchases } from '@/lib/context/purchase'
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/modules/ui/table"



export default function PurchasesTableList({ companyId }: { companyId: string }) {

    const { getPurchase, loadMoreData, fetchingPurchases, fetchPurchases, purchases } = usePurchases();
    const { currentCompany } = useAuth();
    return (
        <Card>
            <CardHeader className="px-7 ">
                <div className='flex w-full justify-between items-center'>
                    <div className='flex flex-col gap-2'>
                        <CardTitle>Purchases list</CardTitle>
                        <CardDescription>Listing of all the purchases</CardDescription>
                    </div>
                    <Button
                        variant={"secondary"}
                        className='flex gap-2 p-x4 py-2'
                        onClick={() => {
                            if (currentCompany) getPurchase({ companyId: currentCompany?.companyId });
                        }}
                    >
                        {/* <AddSVG /> */}
                        <LanguageTranslator>
                            Refetch
                        </LanguageTranslator>
                    </Button>
                </div>

            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Type</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Purchase Type</TableHead>
                            <TableHead className="table-cell text-center">Unit</TableHead>
                            <TableHead className="table-cell text-center">Unit Price</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Inventory</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases[companyId] && purchases[companyId].map((purchase, index) => {
                            return <TableRow
                                key={index}
                                className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">
                                        {
                                            purchase &&
                                                purchase.vendor &&
                                                purchase.vendor.profile &&
                                                purchase.vendor.profile.tinNumber ?
                                                purchase.vendor.profile.tinNumber :
                                                "---"
                                        }
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase &&
                                        purchase.vendor &&
                                        purchase.vendor.profile &&
                                        purchase.vendor.profile.companyName ?
                                        purchase.vendor.profile.companyName :
                                        "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase && purchase.totalVat ? `${purchase.totalVat}` : "---"}
                                </TableCell>
                                <TableCell className="table-cell text-center">
                                    {purchase && purchase.taxableAmount ? `${purchase.taxableAmount}` : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {purchase && purchase.nonTaxableAmount ? `${purchase.nonTaxableAmount}` : "---"}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-center ">
                                    {purchase && purchase.grossAmount ? `${purchase.grossAmount}` : "---"}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-center ">
                                    {purchase && purchase.createdAt ? `${purchase.createdAt.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}` : "---"}
                                </TableCell>
                            </TableRow>
                        })}


                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className='w-full flex justify-center'>
                    {loadMoreData && <div className='w-full flex justify-center'>
                        <Button
                            disabled={fetchingPurchases}
                            variant={"outline"}
                            className='px-5 py-2'
                            onClick={() => {
                                if (currentCompany)
                                    fetchPurchases({ companyId: currentCompany?.companyId });
                            }}>

                            {fetchingPurchases && <div className='animate-spin '>
                                <LoadingSVG className="h-5 w-5 stroke-[1]" />
                            </div>}
                            Load More
                        </Button>
                    </div>}
                </div>
            </CardFooter>
        </Card>
    )
}
