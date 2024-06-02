import UsersList from "@/components/users/users-list";
import prisma from "@/core/db";

export default async function Page(){
  return <UsersList levels={await prisma.level.findMany()} positions={await prisma.position.findMany()}/>
}