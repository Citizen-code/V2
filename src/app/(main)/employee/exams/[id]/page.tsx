import ExamPassing from "@/components/tests/employee/exam-passing";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";
import { getServerSession } from "next-auth/next";

export default async function Page({params}:{params:{id:string}}) {
  const session = await getServerSession(authConfig)
  const test = await prisma.test_result.findFirst({where:{id:params.id, employee_id:session?.user?.id, test:{type_id:2}}, include:{test:{include:{test_questions:true}}, result_questions:true}})
  if (!test) throw new Error("Тестирование не найдено.");
  return <ExamPassing test_questions={test.test.test_questions} results={test.result_questions} result_id={test.id} level_id={test.test.level_id}/>
}