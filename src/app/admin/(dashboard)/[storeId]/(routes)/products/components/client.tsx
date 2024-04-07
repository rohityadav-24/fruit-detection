"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/admin/ui/heading";
import { Separator } from "@/components/admin/ui/separator";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";

import { ProductColumn, columns } from "./columns";

interface ProductClientProps {
    data: ProductColumn[];
};

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Products (${data.length})`}
                    description="Manage products for your store."
                />
                <Button onClick={() => router.push(`/admin/${params.storeId}/products/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey={"name"} />
        </>
    );
};