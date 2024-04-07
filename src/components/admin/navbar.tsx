import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/admin/store-switcher";
import { MainNav } from "@/components/admin/main-nav";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import prismadb from "@/lib/admin/prismadb";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/admin/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    }
  });

  return ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
 
export default Navbar;
