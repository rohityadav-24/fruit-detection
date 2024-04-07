import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/admin/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/admin/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    }
  });

  if (store) {
    redirect(`/admin/${store.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};
