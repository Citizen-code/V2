import TestsList from "@/components/tests/admin/tests-list";
import prisma from "@/core/db";

export default async function Page(){
  return <TestsList levels={await prisma.level.findMany()} categories={await prisma.category.findMany()} type_test={await prisma.type_test.findMany({})}/>
}