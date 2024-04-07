"use client";

import { useState } from "react";
import * as z from "zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/admin/ui/heading";
import { Button } from "@/components/admin/ui/button";
import { Separator } from "@/components/admin/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/admin/ui/form";
import { Input } from "@/components/admin/ui/input";
import { AlertModal } from "@/components/admin/modal/alert-modal";
import { useOrigin } from "@/hooks/admin/use-origin";

interface SettingsFormProps {
    initialData: Store;
};

const formSchema = z.object({
    name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>;

export function SettingsForm({ initialData }: SettingsFormProps) {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store settings updated.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // const onDelete = async () => {
    //     try {
    //         setLoading(true);
    //         await axios.delete(`/api/stores/${params.storeId}`);
    //         router.refresh();
    //         router.push("/");
    //         toast.success("Store deleted.");
    //     } catch (error) {
    //         toast.error("Make sure to delete all products and categories before deleting the store.");
    //     } finally {
    //         setOpen(false);
    //     }
    // }

    return (
        <>
            {/* <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            /> */}
            <div className="flex justify-between items-center">
                <Heading
                    title="Settings"
                    description="Manage store preferences."
                />
                {/* <Button
                    disabled={loading}
                    variant={"destructive"}
                    size={"sm"}
                    onClick={() => setOpen(true)}
                >
                    <Trash className="w-4 h-4" />
                </Button> */}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Store Name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
        </>
    );
}