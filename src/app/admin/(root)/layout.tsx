import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const { userId } = auth();

    if (!userId) {
        redirect("/admin/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    });

    if (store) {
        redirect(`/admin/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    )

}