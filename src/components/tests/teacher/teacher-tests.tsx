import type { level, test, test_public, test_questions, test_result, test_visited } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CreateTestButton from "@/components/tests/teacher/create-test-button";
import { TestParams } from "@/components/tests/teacher/test-params";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import prisma from '@/core/db'

import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { VscPass } from "react-icons/vsc";
import { Suspense } from "react";
import Link from "next/link";

export default async function TeacherTests({ employee_id }: { employee_id: string }) {
  const tests = await prisma.test.findMany({ where: { author_id: employee_id }, include: { level: true, test_public: true, test_result: true, test_visited: true, test_questions: true } });
  return (
    <div className="container pt-4">
      <div className='flex justify-between'>
        <h2 className="text-4xl font-bold col-span-2">Ваши тесты</h2>
        <TestParams />
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateTestButton author_id={employee_id} levels={await prisma?.level.findMany()} category={await prisma.category.findMany()} type={await prisma.type_test.findMany()} />
        <Suspense fallback={[1, 2, 3, 4].map((el) => <Skeleton key={(el)} className="border-2 border-primary-/20 h-[190px] w-full" />)}>
          {tests.map((test) => <TestCard key={test.id} test={test} />)}
        </Suspense>
      </div>
    </div>
  );
}


function TestCard({ test }: { test: test & { level: level | undefined, test_public: test_public | null, test_result: test_result[] | undefined, test_visited: test_visited[] | undefined, test_questions: test_questions[] | undefined } }) {
  return (
    <Card className='flex flex-col flex-grow'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{test.name}</span>
          <div className='gap-2 flex'>
            {test.test_public && <Badge>Опубликован</Badge>}
            {!test.test_public && <Badge variant={"destructive"}>Черновик</Badge>}
            {test.level && <Badge variant={'secondary'}>{test.level.name}</Badge>}
          </div>
        </CardTitle>
        <CardDescription className="flex justify-between gap-2 text-muted-foreground text-sm pt-1">
          <span className='flex gap-2'>
            {test.test_public && 
              <span className="flex items-center gap-2">
                <VscPass className="text-muted-foreground" />
                <span>{test.test_result?.length ?? 0}</span>
              </span>
            }
            {test.test_public && 
              <span className="flex items-center gap-2">
                <FaRegEye className="text-muted-foreground" />
                <span>{test.test_visited?.length ?? 0}</span>
              </span>
            }
          </span>
          <span className='flex gap-2'>
            <span className="flex items-center gap-2">
              <MdOutlineQuestionAnswer className="text-muted-foreground" />
              <span>{test.test_questions?.length ?? 0}</span>
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      {(test.test_public && test.description) && <CardContent className="truncate text-sm text-muted-foreground">{test.description}</CardContent>}
      {!test.test_public && <CardContent className="truncate text-sm text-muted-foreground">{test.description || "Нет описания"}</CardContent>}
      <CardFooter className=' mt-auto'>
        {test.test_public &&
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/tests/${test.id}`}>Просмотреть тест<BiRightArrowAlt/></Link>
          </Button>
        }
        {!test.test_public &&
          <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
            <Link href={`/builder/${test.id}`}>Изменить тест <FaEdit/></Link>
          </Button>
        }
      </CardFooter>
    </Card>
  );
}
