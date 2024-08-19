import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Overview
            </Link>
            <Link
                href="/sales"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Sales
            </Link>
            <Link
                href="/withholding"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Withholding
            </Link>
            <Link
                href="/employee"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Employee
            </Link>
            <Link
                href="/purchase"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Purchase
            </Link>
        </nav>
    )
}