import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/admin/navbar'
import prismadb from '@/lib/admin/prismadb';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/admin/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    }
  });

  if (!store) {
    redirect('/admin');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
