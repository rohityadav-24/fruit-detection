import prismadb from "@/lib/admin/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  let product = null;
  try {
    product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      }
    });
  } catch (error) {
    product = null;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}

export default ProductPage;
