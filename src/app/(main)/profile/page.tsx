import TeacherProfile from "@/components/profile/teacher/teacher";
import prisma from "@/core/db";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth";
import EmployeeProfile from "@/components/profile/employee/employee";

export default async function Page() {
  const session = await getServerSession(authConfig)
  const user = await prisma.employee.findFirstOrThrow({where:{id:session?.user?.id}, include:{employee_position:true}})
  const is_teacher = user.employee_position.findIndex(i => i.position_id === 1) !== -1
  return is_teacher ? <TeacherProfile/> : <EmployeeProfile/>
}