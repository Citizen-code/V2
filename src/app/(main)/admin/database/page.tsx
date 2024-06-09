import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/core/db";
import SqlExecute from "@/components/database/sql-execute";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";


export default async function Page() {

  const data = (await prisma.$queryRaw`Select xact_commit, xact_rollback, tup_inserted, tup_updated, tup_deleted from pg_stat_database where datname = 'education2'` as any[])[0];
  return <div className="container pt-4">
    <div className='flex justify-between'>
      <h2 className="text-4xl font-bold col-span-2">База данных</h2>
    </div>
    {data?.length !== 0 && <>
      <Separator className="my-6" />
      <ScrollArea>
        <div className="flex items-stretch my-1 gap-3">
          <StatsCard
            title="Количество ошибок"
            icon={null}
            helperText="Информация о количестве ошибок в запросах."
            value={data.xact_rollback.toString()}
            className="shadow-md shadow-cyan-600"
          />
          <StatsCard
            title="Количество добавленных"
            icon={null}
            helperText="Информация о количестве добавленных записей."
            value={data.tup_inserted.toString()}
            className="shadow-md shadow-red-600"
          />
          <StatsCard
            title="Количество измененных"
            icon={null}
            helperText="Информация о количестве измененных записей."
            value={data.tup_updated.toString()}
            className="shadow-md shadow-pink-600"
          />
          <StatsCard
            title="Количество удаленных"
            icon={null}
            helperText="Информация о количестве удаленных записей."
            value={data.tup_deleted.toString()}
            className="shadow-md shadow-purple-600"
          />
        </div>
        <div className='py-1 my-2'><ScrollBar orientation='horizontal' /></div>
      </ScrollArea>
    </>}
    <Separator className="my-6" />
    <SqlExecute />
  </div >
}

function StatsCard({ title, value, icon, helperText, className, }: { title: string; value: string; helperText: string; className: string; icon: ReactNode; }) {
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