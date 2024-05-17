import prisma from "@/core/db";
import EmployeeExams from "@/components/tests/employee/employee-exams";
import authConfig from "@/core/auth-config";
import { getServerSession } from 'next-auth/next'

export default async function Home() {
  const session = await getServerSession(authConfig)
  return (
    <EmployeeExams employee_levels={await prisma.employee_level.findMany({where:{employee_id:session?.user?.id}})} levels={await prisma.level.findMany()} categories={await prisma.category.findMany()}/>
  );
}
