import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import prisma from "@/core/db";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataRadar from "./data-radar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default async function TeacherProfile() {
  const session = await getServerSession(authConfig)
  const user = await prisma.employee.findFirstOrThrow({ where: { id: session?.user?.id }, include: { employee_position: { include: { position: true } } } })
  const data = await GetTestsStats(session?.user?.id);

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
          <Separator />
          <ScrollArea>
            <CardContent className="px-1 py-1 pb-3 overflow-x-auto mt-2 gap-4 flex">
              <StatsCard
                title="Создано тестирований тестирований"
                icon={<HiCursorClick className="text-red-600" />}
                helperText="Количество созданных тестирований"
                value={data.tests.toLocaleString()}
                className="shadow-md shadow-red-600"
              />
              <StatsCard
                title="Количество вопросов"
                icon={<FaWpforms className="text-yellow-600" />}
                helperText="Общее количество вопросов в тестированиях"
                value={data.questions.toLocaleString()}
                className="shadow-md shadow-yellow-600"
              />
              <StatsCard
                title="Прохождение тестирований"
                icon={<HiCursorClick className="text-green-600" />}
                helperText="Общее количество прохождения тестирований"
                value={data.results.toLocaleString()}
                className="shadow-md shadow-green-600"
              />
              <StatsCard
                title="Просмотры тестирований"
                icon={<LuView className="text-blue-600" />}
                helperText="Общее количество просмотров тестирований"
                value={data.visits.toLocaleString()}
                className="shadow-md shadow-blue-600"
              />
            </CardContent>
            <div className='mt-2'>
              <ScrollBar orientation='horizontal' />
            </div>
          </ScrollArea>
        </Card>
      </div>
      <Tabs className='px-4' defaultValue="category">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category">Категории</TabsTrigger>
          <TabsTrigger value="level">Уровни</TabsTrigger>
        </TabsList>
        <TabsContent className='min-h-[100px]' value="category">
          <DataRadar data={data.categories} />
        </TabsContent>
        <TabsContent className='min-h-[100px]' value="level">
          <DataRadar data={data.levels} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function GetTestsStats(id: string | undefined) {
  const data = await prisma.test.findMany({
    where: { author_id: id }, select: { _count: { select: { test_visited: true, test_questions: true, test_result: true } } }
  })
  return {
    tests: data.length,
    visits: data.reduce((sum, i) => sum + i._count.test_visited, 0),
    questions: data.reduce((sum, i) => sum + i._count.test_questions, 0),
    results: data.reduce((sum, i) => sum + i._count.test_result, 0),
    categories: (await prisma.category.groupBy({ where: { test: { every: { author_id: id } } }, by: ['name'], _sum: { 'id': true } })).map(item => { return { subject: item.name, A: item._sum.id, fullMark: data.length } }),
    levels: (await prisma.level.groupBy({ where: { test: { every: { author_id: id } } }, by: ['name'], _sum: { 'id': true } })).map(item => { return { subject: item.name, A: item._sum.id, fullMark: data.length } })
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