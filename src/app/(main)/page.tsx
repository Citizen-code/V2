import TeacherTests from "@/components/tests/teacher/teacher-tests";
import { getServerSession } from "next-auth";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";
import EmployeeTests from "@/components/tests/employee/employee-tests";

export default async function Home() {
  const session = await getServerSession(authConfig)
  const employee = await prisma.employee.findFirstOrThrow({where:{id:session?.user?.id}, include:{employee_position:true}})
  const is_teacher = employee.employee_position.findIndex(i => i.position_id === 1) !== -1

  return (
    <>
      {is_teacher? <TeacherTests employee_id={employee.id}/>: <EmployeeTests/>}
    </>
  );
}
