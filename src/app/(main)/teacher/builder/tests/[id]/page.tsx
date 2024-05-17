import TestBuilder from "@/components/tests/builder/test-builder";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";
import { getServerSession } from "next-auth";

export default async function Page({params}:{params:{id:string}}) {
  const session = await getServerSession(authConfig)
  const test = await prisma.test.findFirstOrThrow({where:{id:params.id, author_id:session?.user?.id}, include:{test_questions:true, test_public:true}})
  if (!test) throw new Error("Тестирование не найдено.");
  return ( <TestBuilder test={test} types={await prisma.type_question.findMany()}/> )
}