import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/admin/navbar";

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string };
}) {

    const { userId } = auth();

    if (!userId) {
        redirect("/admin/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    if (!store) {
        redirect("/admin");
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )

}