import TestInfo from "@/components/tests/teacher/test-info";
import prisma from "@/core/db";

export default async function Page({params}:{params:{id:string}}) {
  const test = await prisma.test.findFirst({
    where:{
      id:params.id,
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
  return <TestInfo test={test} is_edit={false}/>
}