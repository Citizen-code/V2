import TestPassing from "@/components/tests/employee/test-passing";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";
import { getServerSession } from "next-auth/next";

export default async function Page({params}:{params:{id:string}}) {
  const session = await getServerSession(authConfig)
  const test = await prisma.test_result.findFirst({where:{id:params.id, employee_id:session?.user?.id}, include:{test:{include:{test_questions:true}}, result_questions:true}})
  if (!test) throw new Error("Тестирование не найдено.");
  return <TestPassing test_questions={test.test.test_questions} results={test.result_questions} result_id={test.id} test_id={test.test_id}/>
}