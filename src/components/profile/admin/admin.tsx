import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/core/db";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function AdminProfile() {
  const session = await getServerSession(authConfig)
  const user = await prisma.employee.findFirstOrThrow({ where: { id: session?.user?.id }, include: { employee_position: { include: { position: true } } } })

  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex'>
        <div className='flex my-6 ms-4'>
          <Image className="block dark:hidden rounded-lg" src={user.image ?? '/im-missing-light.svg'} alt="Изображение профиля" width={300} height={75} />
          <Image className="hidden dark:block rounded-lg" src={user.image ?? '/im-missing-dark.svg'} alt="Изображение профиля" width={300} height={75} />
        </div>
        <Card className='flex flex-col overflow-x-auto m-6 p-6 w-full'>
          <CardHeader className='p-2'>
            <CardTitle className='font-bold text-3xl'>
              {`${user.surname} ${user.name} ${user.patronymic}`}
            </CardTitle>
            <div className='my-2 flex flex-wrap'>{user.employee_position.map((el) => <Badge key={el.position_id} variant={el.position_id === 1 ? 'destructive' : 'default'}>{el.position.name}</Badge>)}</div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}