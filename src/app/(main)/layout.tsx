import Logo from "@/components/layout/logo";
import ThemeSwitcher from "@/components/layout/theme-switcher";
import UserAvatar from "@/components/layout/user-avatar";
import { GetRole } from "@/utility/check-role";
import React from "react";

export default async function Layout({children}:{children:React.ReactNode}) {   
  const role = await GetRole();

  return (
    <div className='flex flex-col min-h-screen min-w-full max-h-screen'>
      <nav className='flex justify-between px-4 py-2 border-b border-border'>
        <Logo />
        <div className='flex gap-4 items-center'>
          <ThemeSwitcher />
          <UserAvatar role={role} />
        </div>
      </nav>
      {children}
    </div>
  )
}