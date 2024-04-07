import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { SettingsForm } from "./components/form";

interface SettingsPageProps {
    params: {
        storeId: string;
    };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { userId } = auth();

    if (!userId) {
        redirect("/admin/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if (!store) {
        redirect("/admin");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-py-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}