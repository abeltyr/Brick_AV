"use client"

import AddSVG from '@/assets/icons/add'
import LoadingSVG from '@/assets/icons/loading'
import { useAuth } from '@/lib/context/auth/user'
import { useVendors } from '@/lib/context/vendor'
import { LanguageTranslator } from '@/modules/language/components'
import { Badge } from "@/modules/ui/badge"
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
import { VendorType } from '@/types/vendor'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/modules/ui/pagination"
import { limitAmount } from '@/lib/utils/limiter'
import { useCompany } from '@/lib/context/account'



export default function VendorsTableList({ vendors }: { vendors: VendorType[] }) {

    const { getVendor, loadMoreData, fetchingVendors, fetchVendors } = useVendors();
    const { currentCompany } = useCompany();
    return (
        <Card>
            <CardHeader className="px-7 ">
                <div className='flex w-full justify-between items-center'>
                    <div className='flex flex-col gap-2'>
                        <CardTitle>Vendors list</CardTitle>
                        <CardDescription>Listing of all the vendors</CardDescription>
                    </div>
                    <Button className='flex gap-2 p-x4 py-2'
                        variant={"secondary"}
                        onClick={() => {
                            if (currentCompany) getVendor({ companyId: currentCompany?.companyId });
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
                            <TableHead className="text-left">Company Name</TableHead>
                            <TableHead className="text-left">Tin Number</TableHead>
                            <TableHead className="hidden sm:table-cell text-left">Vat</TableHead>
                            <TableHead className="hidden md:table-cell text-left">Email</TableHead>
                            <TableHead className="hidden md:table-cell text-left">Phone number</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.map((data, index) => {
                            return <TableRow
                                key={index}
                                className="bg-accent">
                                <TableCell className="table-cell text-left">
                                    {data && data.name ? data.name : "---"}
                                </TableCell>
                                <TableCell className="text-left">
                                    <div className="font-medium">
                                        {data.business && data.business.tinNumber ? data.business.tinNumber : "---"}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-left">
                                    {data && data.vat ? data.vat : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-left">
                                    {data && data.email ? data.email : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-left">
                                    {data && data.phoneNumber ? data.phoneNumber : "---"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right ">
                                    {data.createdAt && data.createdAt.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
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
                            disabled={fetchingVendors}
                            variant={"outline"}
                            className='px-5 py-2'
                            onClick={() => {
                                if (currentCompany)
                                    fetchVendors({ companyId: currentCompany?.companyId });
                            }}>

                            {fetchingVendors && <div className='animate-spin '>
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
