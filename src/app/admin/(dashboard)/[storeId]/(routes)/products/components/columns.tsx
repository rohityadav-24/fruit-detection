"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-actions";

export type ProductColumn = {
    id: string
    name: string
    price: string
    stock: number
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "stock",
        header: "Stock",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "action",
        cell: ({ row }) => <CellAction data={row.original} />,
        header: "Action",
    },
]
