"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/admin/${params.storeId}`,
            label: `Overview`,
            active: pathname === `/admin/${params.storeId}`
        },
        {
            href: `/admin/${params.storeId}/products`,
            label: `Products`,
            active: pathname.includes(`/admin/${params.storeId}/products`)
        },
        {
            href: `/admin/${params.storeId}/orders`,
            label: `Orders`,
            active: pathname.includes(`/admin/${params.storeId}/orders`)
        },
        {
            href: `/admin/${params.storeId}/settings`,
            label: `Settings`,
            active: pathname === `/admin/${params.storeId}/settings`
        },
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground",
                    )}
                >
                    {route.label}
                </Link>))}
        </nav>
    )
}