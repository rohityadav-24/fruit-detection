import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

export default async function Page({ params }: { params: { storeId: string } }) {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        stock: item.stock,
        price: formatter.format(item.price),
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-py-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}