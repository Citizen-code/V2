'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function UserAvatar() {
  const {push} = useRouter();
  
  const session = useSession().data;
  if (!session) return null;
  
  const names = session.user?.name?.split(' ') ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={session.user?.image ?? ''} alt="Аватар" />
          <AvatarFallback>{`${names[0][0]} ${names[1][0]}`}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => push('/profile')}>
            Профиль
            <DropdownMenuShortcut><CgProfile/></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Выйти
            <DropdownMenuShortcut className="text-muted-foreground"><CiLogout/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

