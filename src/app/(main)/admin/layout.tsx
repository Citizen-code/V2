import React from "react";
import Menu from "@/components/layout/menu/admin-menu";
import { GetRole, Role } from "@/utility/check-role";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  if (await GetRole() !== Role.admin) redirect('/')

  return (
    <>
      <div className="shadow-md shadow-border py-2">
        <Menu />
      </div>
      <main className='flex flex-col w-full flex-grow'>
        {children}
      </main>
    </>
  )
}