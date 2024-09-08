import AddSVG from '@/assets/icons/add'
import LoadingSVG from '@/assets/icons/loading'
import { useAuth } from '@/lib/context/auth/user'
import { useVendors } from '@/lib/context/vendor'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { Button } from '@/modules/ui/button'
import { Card, CardContent, CardFooter } from '@/modules/ui/card'
import { Checkbox } from '@/modules/ui/checkbox'
import { Input } from '@/modules/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table'
import { VendorType } from '@/types/vendor'
import { CirclePlus } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

export const VendorDrawerTable = ({
    setIsAddingVendor,
    updateVendor
}: {
    setIsAddingVendor: (value: boolean) => void
    updateVendor: (vendor: VendorType) => void
}) => {

    const { getVendor, vendors, loadMoreData, fetchingVendors, fetchVendors, searchVendor, initialLoading } = useVendors();
    const { currentCompany } = useAuth();

    const [searchTerm, setSearchTerm] = useState("")
    const [currentVendors, setCurrentVendors] = useState<VendorType[] | null>()

    useEffect(() => {
        if (currentCompany) {
            if (!vendors[currentCompany.companyId])
                getVendor({ companyId: currentCompany.companyId })
        }
    }, [currentCompany, getVendor, vendors])

    useEffect(() => {
        if (currentCompany && currentCompany.companyId && vendors[currentCompany.companyId] && !searchTerm) {
            const data = vendors[currentCompany.companyId]
            setCurrentVendors(data)
        }

    }, [vendors, currentCompany, searchTerm])

    const [loading, setLoading] = useState(initialLoading)


    const [isLoading, setIsLoading] = useState(false)
    const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null)

    const searchVendors = useCallback(async (term: string) => {
        if (currentCompany) {
            setIsLoading(true)
            const results = await searchVendor({
                companyId: currentCompany?.companyId,
                keyTerm: term
            })
            setCurrentVendors(results)
            setIsLoading(false)
        }
    }, [currentCompany, searchVendor])



    return (

        <div className='space-y-2 w-full h-full relative pb-20 p-6'>
            <div className="flex justify-between items-center gap-4">
                <Input
                    placeholder="Search Vendors..."
                    value={searchTerm}
                    onChange={(e) => {
                        const searchWord = e.target.value;
                        setSearchTerm(searchWord)
                        if (searchWord.length > 0 && currentVendors) {
                            const localResults = currentVendors.filter((vendor) => {
                                return (
                                    vendor?.profile?.tinNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    vendor?.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    vendor?.profile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    vendor?.profile?.vatNumber?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                            }
                            )
                            setCurrentVendors(localResults)
                        } else if (currentCompany)
                            setCurrentVendors(vendors[currentCompany.companyId])
                    }}
                    className="min-w-64 pr-8 flex-1 px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400"
                />
                <Button onClick={() => setIsAddingVendor(true)}>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add Vendor
                </Button>
            </div>
            <Card className="flex flex-col flex-1 relative w-full h-full gap-6 overflow-y-auto " >
                <CardContent className='p-0' >
                    <Table >
                        <TableHeader >
                            <TableRow>
                                <TableHead className="w-[50px]">Select</TableHead>
                                <TableHead className=" text-center">Company Name</TableHead>
                                <TableHead className="hidden sm:table-cell text-center">Seller Name</TableHead>
                                <TableHead>Tin Number</TableHead>
                                <TableHead className="hidden md:table-cell text-center">vatNumber</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody >
                            {
                                currentVendors && currentVendors.length > 0
                                    ? (
                                        currentVendors.map((vendor) => (
                                            <TableRow key={vendor.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedVendor ? selectedVendor.id === vendor.id : false}
                                                        onCheckedChange={() => {
                                                            if (selectedVendor && selectedVendor.id === vendor.id) {
                                                                setSelectedVendor(null)
                                                                return
                                                            }
                                                            setSelectedVendor(vendor)

                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="table-cell text-center">
                                                    {vendor.profile && vendor.profile.companyName ? vendor.profile.companyName : "---"}
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-center">
                                                    {vendor.profile && vendor.profile.name ? vendor.profile.name : "---"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {vendor.profile && vendor.profile.tinNumber ? vendor.profile.tinNumber : "---"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-center">
                                                    {vendor.profile && vendor.profile.vatNumber ? vendor.profile.vatNumber : "---"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow >
                                            <TableCell colSpan={5} className="text-center">
                                                <div className='min-h-[600px] flex justify-center items-center'>
                                                    {loading ? "Searching..." : "No results found"}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                        </TableBody>
                    </Table>
                </CardContent>
                {loadMoreData && <CardFooter>
                    <div className='w-full flex justify-center'>
                        <div className='w-full flex justify-center'>
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
                        </div>
                    </div>
                </CardFooter>}
            </Card>
            <DrawerSheetFooter
                isLoading={false}
                createSVG={<AddSVG />}
                create='Insert'
                disabled={selectedVendor === null}
                createFunction={() => {
                    if (selectedVendor)
                        updateVendor(selectedVendor)
                }}
            />
        </div>
    )
}
