import TestPassing from "@/components/tests/employee/test-passing";
import TestInfo from "@/components/tests/teacher/test-info";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";
import { getServerSession } from "next-auth/next";

export default async function Page({params}:{params:{id:string}}) {
  const session = await getServerSession(authConfig)
  const test = await prisma.test.findFirst({
    where:{
      id:params.id,
      author_id:session?.user?.id,
      // type_id:1,
      NOT:{test_public:null}
    },
    include:{
      category:true,
      level:true,
      type_test:true,
      employee:true,
      _count:{
        select:{
          test_questions:true,
          test_result:true,
        }
      }
    }
  })
  if (!test) throw new Error("Тестирование не найдено.");
  return <TestInfo test={test}/>
}