'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"
import { LanguageTranslator } from '@/modules/language/components'
import OverViewSVG from '@/assets/icons/overview'
import ProductSVG from '@/assets/icons/product'
import VendorSVG from '@/assets/icons/vendor'
import PurchaseSVG from '@/assets/icons/purchase'
import { useState } from 'react'


const navList = [
    {
        name: "Overview",
        href: "/",
        icon: <OverViewSVG />,
    },
    {
        name: "Vendors",
        href: "/vendors",
        icon: <VendorSVG />,
    },
    {
        name: "Products",
        href: "/products",
        icon: <ProductSVG />,
    },
    {
        name: "Purchases",
        href: "/purchases",
        icon: <PurchaseSVG />,
    },
]

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const [indexData, setIndexData] = useState(0)
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >

            {navList.map((data, index) => {
                return (
                    <Link
                        onClick={() => {
                            setIndexData(index)
                        }}
                        id={`purchase-${index}`}
                        key={index}
                        href={data.href}
                        className={`text-sm font-medium transition-colors  hover:text-primary flex gap-2 ${indexData === index ? "text-primary" : "text-primary/50"}`}
                    >
                        {data.icon}
                        <LanguageTranslator>
                            {data.name}
                        </LanguageTranslator>
                    </Link>
                )
            })}

        </nav>
    )
}