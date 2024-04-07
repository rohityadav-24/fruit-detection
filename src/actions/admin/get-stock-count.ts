import prismadb from "@/lib/admin/prismadb";

export const getStockCount = async (storeId: string) => {
  const stockCount = await prismadb.product.count({
    where: {
      storeId
    }
  });

  return stockCount;
};
