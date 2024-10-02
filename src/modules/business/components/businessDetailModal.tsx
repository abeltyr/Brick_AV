"use client"

import * as React from "react"
import { Button } from "@/modules/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/modules/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/modules/ui/table"
import { BusinessType } from '@/types/business'
import { Separator } from '@/modules/ui/separator'
import CloseCircleSVG from '@/assets/icons/closeCircle'
import { Card, CardContent, CardHeader } from '@/modules/ui/card'
import { formatBusinessType } from '@/lib/utils/buissness'
import { BusinessLegalCondition } from '@prisma/client'



// const newBusinessFetched = {
//     addressId: "1",
//     businessName: 'acme.com',
//     BusinessTrade: [
//         {
//             id: "21",
//             tradeName: 'ETHIO TELECOM S C',
//             licenseCode: "31021",
//             licenseName: 'Fixed property subletting/ renting activities',
//             licenseNumber: 'MT/AA/14/669/3872789/2014',
//             RenewedTo: new Date('7/7/2023'),
//             RenewedFrom: new Date('7/7/2024'),
//             dateRegistered: new Date('7/7/2024'),
//             RenewalDate: new Date('7/7/2024'),
//             businessId: "21",
//             tradeNameAmh: "21"
//         },
//         {
//             id: "21",
//             tradeName: 'ETHIO TELECOM S C',
//             licenseCode: "31021",
//             licenseName: 'Fixed property subletting/ renting activities',
//             licenseNumber: 'MT/AA/14/669/3872789/2014',
//             RenewedTo: new Date('7/7/2023'),
//             RenewedFrom: new Date('7/7/2024'),
//             dateRegistered: new Date('7/7/2024'),
//             RenewalDate: new Date('7/7/2024'),
//             businessId: "21",
//             tradeNameAmh: "21"
//         },
//     ],
//     businessNameAmh: "",
//     tin: '0090866119',
//     legalCondition: BusinessLegalCondition.GeneralPartnership,
//     registrationNo: 'MT/AA/5/006147584',
//     dateRegistered: new Date('2/1/12'),
//     paidUpCapital: 100000000000,
//     id: "",
//     managerName: "",
//     managerNameEng: "",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     deletedAt: new Date(),

// }



export function BusinessDetailModal({
    businessFetched,
    handleClose,
    handleContinue,
    isOpen,
    setIsOpen,
    viewingOnly = false,
    name = ""
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleClose: () => void,
    handleContinue: () => void
    businessFetched: BusinessType | null,
    viewingOnly?: Boolean
    name?: string
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[1000px] px-0">
                <DialogHeader >
                    <div className='px-8 flex justify-between items-center w-full'>
                        <p className="text-3xl font-extrabold">
                            {!viewingOnly ? "Does everything looks right?" : `Business Information`}
                        </p>
                        <div
                            className='cursor-pointer select-none'
                            onClick={() => {
                                handleClose()
                            }}>
                            <CloseCircleSVG />
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                {businessFetched && <div className="space-y-6">
                    <Card className='mx-8'>
                        <CardHeader className='py-6'>
                            <h3 className="text-lg font-semibold">Business Detail</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-[#09090B]">
                                <div className='flex flex-col gap-2'>
                                    <p className='text-[#616161]'>
                                        <span className="font-medium text-[#09090B] text-base">
                                            TIN Number : {" "}
                                        </span>
                                        {businessFetched.tin}
                                    </p>
                                    <p className='text-[#616161]'>
                                        <span className="font-medium text-[#09090B] text-base">
                                            Name : {" "}
                                        </span>
                                        {businessFetched.businessName}
                                    </p>
                                    <p className='text-[#616161]'>
                                        <span className="font-medium text-[#09090B] text-base">
                                            Legal Condition : {" "}
                                        </span>
                                        {formatBusinessType(businessFetched.legalCondition)}
                                    </p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-[#616161]'>
                                        <span className="font-medium text-[#09090B] text-base">
                                            Registration Number : {" "}
                                        </span>
                                        {businessFetched.registrationNo}
                                    </p>
                                    <p className='text-[#616161]'>
                                        <span className="font-medium text-[#09090B] text-base">
                                            Registration Date : {" "}
                                        </span>
                                        {businessFetched.dateRegistered ? new Date(businessFetched.dateRegistered).toLocaleDateString("en-GB") : "-"}
                                    </p>
                                    <p className='text-[#616161]'>
                                        <span className="font-medium text-[#09090B] text-base">
                                            Capital : {" "}
                                        </span>
                                        {businessFetched.paidUpCapital}
                                    </p>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mx-8'>
                        <CardHeader className='py-6'>
                            <h3 className="text-lg font-semibold">Business License</h3>
                        </CardHeader>
                        <CardContent className='px-0 max-h-[400px] overflow-y-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='text-[#4C4C4C] bg-[#F7F7F7]'>
                                        <TableHead className='text-left'>TRADE NAME</TableHead>
                                        <TableHead className='text-left'>Section</TableHead>
                                        <TableHead className='text-left'>License Code</TableHead>
                                        <TableHead className='text-left'>License Time span</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    {businessFetched.businessTrade.map((businessData, index) => (
                                        <TableRow key={index} className='text-primary'>
                                            <TableCell className='text-left'>{businessData.tradeName}</TableCell>
                                            <TableCell className='text-left'>{businessData.licenseName}</TableCell>
                                            <TableCell className='text-left'>{businessData.licenseCode}</TableCell>
                                            <TableCell className='text-left'>{businessData.renewedFrom ? new Date(businessData.renewedFrom).toLocaleDateString("en-GB") : "-"}-{businessData.renewedTo ? new Date(businessData.renewedTo).toLocaleDateString("en-GB") : "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>}
                {!viewingOnly && <DialogFooter className='mx-8'>
                    <Button variant="outline" onClick={handleClose}>No, cancel</Button>
                    <Button onClick={handleContinue}>Yes, continue</Button>
                </DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}

