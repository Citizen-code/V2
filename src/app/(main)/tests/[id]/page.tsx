import TestBuilder from "@/components/tests/builder/test-builder";
import TestWork from "@/components/tests/employee/test-work";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";
import { getServerSession } from "next-auth";

export default async function Page({params}:{params:{id:string}}) {
  const session = await getServerSession(authConfig)
  const test = await prisma.test_public.findFirstOrThrow({where:{test_id:params.id}, include:{test:{include:{test_questions:true}}}})
  if (!test) throw new Error("Тестирование не найдено.");
  return <TestWork questions={test.test.test_questions}/>
}