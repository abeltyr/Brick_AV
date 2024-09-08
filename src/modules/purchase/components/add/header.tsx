import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/modules/ui/breadcrumb'
import { Button } from '@/modules/ui/button'
import { Separator } from '@/modules/ui/separator'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export const AddPurchaseHeader = ({ actionFunction }: { actionFunction: Function }) => {

    const { back } = useRouter();
    return (
        <div className='flex flex-col w-full fixed top-[8vh] left-0 right-0  bg-background z-10 '>
            <div className='screen-padding py-3'>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => {
                        back();
                    }}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <Breadcrumb className="hidden md:flex items-center">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/purchases">Purchases</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Add Purchase</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button size="sm" onClick={(e) => {
                            e.preventDefault();
                            actionFunction()
                        }}> Save Purchase</Button>
                    </div>
                </div>
            </div>
            <Separator />
        </div>
    )
}
