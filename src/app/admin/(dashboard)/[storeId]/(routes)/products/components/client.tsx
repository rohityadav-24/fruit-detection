"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { Heading } from "@/components/admin/ui/heading";
import { Separator } from "@/components/admin/ui/separator";
import { ApiList } from "@/components/admin/ui/api-list";

import { ProductColumn, columns } from "./columns";

interface ProductsClientProps {
  data: ProductColumn[];
};

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Products (${data.length})`} description="Manage products for your store" />
        <Button onClick={() => router.push(`/admin/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Products" /> */}
      {/* <Separator />
      <ApiList entityName="products" entityIdName="productId" /> */}
    </>
  );
};
