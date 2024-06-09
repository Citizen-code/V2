import { Separator } from "@/components/ui/separator";
import { category, employee, level, test, test_result, type_test } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import TableResult from "./table-result";
import prisma from "@/core/db";
import MarkResult from "./mark-result";
import { ResultsTable } from "./results-table";

export default async function TestInfo({ test, is_edit = true }: { test: test & { category: category | undefined, level: level | undefined, type_test: type_test | undefined, employee: employee | undefined, _count: { test_questions: number, test_result: number } }, is_edit?:boolean }) {

  return <div className="container pt-4">
    <div className='flex justify-between'>
      <h2 className="text-4xl font-bold col-span-2">{test.name}</h2>
      {/* {is_edit && <Button>Изменить</Button>} */}
    </div>
    {test.description && <>
      <Separator className="my-4" />
      <div className="text-lg text-muted-foreground break-words mt-2">{test.description}</div>
    </>}
    <Separator className="mt-4 mb-6" />
    <ScrollArea>
      <div className="flex items-stretch my-1 gap-3">
        <StatsCard
          title="Количество вопросов"
          icon={null}
          helperText="Информация о количестве вопросов в тестировании."
          value={test._count.test_questions.toString()}
          className="shadow-md shadow-cyan-600"
        />
        <StatsCard
          title="Количество прохождений"
          icon={null}
          helperText="Информация о количество прохождений тестирования."
          value={test._count.test_result.toString()}
          className="shadow-md shadow-violet-600"
        />
        {test.category && <StatsCard
          title="Категория"
          icon={null}
          helperText="Информация о категории тестирования."
          value={test.category.name}
          className="shadow-md shadow-red-600"
        />}
        {test.level && <StatsCard
          title="Уровень"
          icon={null}
          helperText="Информация об уровне тестирования."
          value={test.level.name}
          className="shadow-md shadow-green-600"
        />}
        {test.type_test && <StatsCard
          title="Тип"
          icon={null}
          helperText="Информация о типе тестирования."
          value={test.type_test.name}
          className="shadow-md shadow-yellow-600"
        />}
        {test.employee && <StatsCard
          title="Автор"
          icon={null}
          helperText="Информация об авторе тестирования."
          value={`${test.employee.surname} ${test.employee.name[0]} ${test.employee.patronymic[0]}`}
          className="shadow-md shadow-pink-600"
        />}
      </div>
      <div className='py-1 my-2'><ScrollBar orientation='horizontal' /></div>
    </ScrollArea>
    <Separator className="mb-6 mt-3" />
    <Tabs className='px-4' defaultValue="questions">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="questions">Результаты ответов на вопросы</TabsTrigger>
        <TabsTrigger value="marks">Распределение результатов тестирования</TabsTrigger>
        <TabsTrigger value="results">Результаты тестирования</TabsTrigger>
      </TabsList>
      <TabsContent className='min-h-[100px]' value="questions">
        <TableResult data={await GetResultsQuestion(test.id)} />
      </TabsContent>
      <TabsContent className='min-h-[100px]' value="marks">
        <MarkResult data={await GetMarksResult(test.id)}/>
      </TabsContent>
      <TabsContent className='min-h-[100px]' value="results">
        <ResultsTable test={test.id}/>
      </TabsContent>
    </Tabs>

  </div >
}

async function GetResultsQuestion(id: string) {
  const questions = await prisma.test_questions.findMany({
    where: { test_id: id },
    include: {
      result_questions: true,
    }
  })
  let count = 0;
  return questions.map(i => {
    const data = Math.round((i.result_questions.filter(el => el.is_correct).length / i.result_questions.length * 100))
    return {
      name: `Вопрос - №${++count}`,
      value: isNaN(data) ? 0 : data
    }
  })
}

async function GetMarksResult(id: string) {
  const employee = await prisma.employee.findMany({
    where:{
      test_result:{
        some:{
          test_id:id,
        }
      }
    },
    include:{
      test_result:{
        where:{test_id:id},
        include:{
          result_questions:true,
          test:{
            include:{
              _count:{
                select:{
                  test_questions:true
                }
              }
            }
          }
        }
      },
    }
  })
  const data:{name:string,value:number}[] = [
    {
      name:'Итоговая оценка 2',
      value:0,
    },
    {
      name:'Итоговая оценка 3',
      value:0,
    },
    {
      name:'Итоговая оценка 4',
      value:0,
    },
    {
      name:'Итоговая оценка 5',
      value:0,
    }
  ]
  for (let index = 0; index < employee.length; index++) {
    const results = employee[index].test_result;
    let max = 0;
    for (let index = 0; index < results.length; index++) {
      const el = results[index];
      const percent = Math.round(el.result_questions.filter(i => i.is_correct).length / el.test._count.test_questions * 100);
      if(max < percent) max = percent;
    }
    if(max >= 90) data[3].value += 1
    else if(max >= 70) data[2].value += 1
    else if(max >= 40) data[1].value += 1
    else data[0].value += 1
  }
  return data;
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