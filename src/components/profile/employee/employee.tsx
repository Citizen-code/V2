import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { FaWpforms } from "react-icons/fa";
import prisma from "@/core/db";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HiCursorClick } from "react-icons/hi";
import { ResultsTable } from "./results-table";
import Layout from "@/app/(main)/employee/layout";

export default async function EmployeeProfile() {
  const session = await getServerSession(authConfig)
  const user = await prisma.employee.findFirstOrThrow({ where: { id: session?.user?.id }, include: { employee_level: { include: { level: true } }, employee_position: { include: { position: true } } } })
  const employee_level = user.employee_level?.reverse().pop();
  const data = await GetStats(session?.user?.id);

  return (
    <Layout>
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
            <Separator />
            <CardContent className="px-1 py-1 pb-3 overflow-x-auto mt-2 gap-4 flex">
              <StatsCard
                title="Текущий уровень языка"
                icon={<HiCursorClick className="text-red-600" />}
                helperText={employee_level ? `Дата получения ${employee_level?.date}` : 'Для получения пройдите тестирования'}
                value={employee_level?.level.name?.toLocaleString() ?? 'Отсутствует'}
                className="shadow-md shadow-red-600"
              />
              <StatsCard
                title="Количество вопросов"
                icon={<FaWpforms className="text-yellow-600" />}
                helperText="Общее количество отвеченных вопросов"
                value={data.questions.toLocaleString()}
                className="shadow-md shadow-yellow-600"
              />
            </CardContent>
          </Card>
        </div>
        <Tabs className='px-4' defaultValue="results">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Пройденные тестирования</TabsTrigger>
            <TabsTrigger value="levels">Повышения уровня</TabsTrigger>
          </TabsList>
          <TabsContent className='min-h-[100px]' value="results">
            <ResultsTable data={await prisma.test_result.findMany({ include: { result_questions: { include: { test_questions: true, test_result: true } }, test: { include: { level: true, category: true, employee: true, _count: { select: { test_questions: true } } } }, _count: { select: { result_questions: true } } } })} />
          </TabsContent>
          <TabsContent className='min-h-[100px]' value="levels">

          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

async function GetStats(id: string | undefined) {
  const data = await prisma.test_result.findMany({
    where: { employee_id: id }, select: { _count: { select: { result_questions: true, } } }
  })
  return {
    completed: data.length,
    questions: data.reduce((sum, i) => sum + i._count.result_questions, 0),
  }
}

export function StatsCard({ title, value, icon, helperText, className, }: { title: string; value: string; helperText: string; className: string; icon: ReactNode; }) {
  return (
    <Card className={cn(className, 'min-w-[325px]')}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  )
}