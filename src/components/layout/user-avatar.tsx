'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Role } from '@/utility/check-role';

export default function UserAvatar({role}:{role:Role}) {
  const {push} = useRouter();
  
  const session = useSession().data;
  if (!session) return null;
  
  const names = session.user?.name?.split(' ') ?? ''
  let url = '/'
  switch (role) {
    case Role.admin:
      url = '/admin/profile'
    break;
    case Role.employee:
      url = '/employee/profile'
    break;
    case Role.teacher:
      url = '/teacher/profile'
    break;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={session.user?.image ?? ''} alt="Аватар" />
          <AvatarFallback>{`${names[0][0]} ${names[1][0]}`}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{`${names[0]} ${names[1]}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => push(url)}>
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

