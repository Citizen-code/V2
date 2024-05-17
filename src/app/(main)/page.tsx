import TeacherProfile from "@/components/profile/teacher/teacher";
import EmployeeProfile from "@/components/profile/employee/employee";
import { GetRole, Role } from "@/utility/check-role";

export default async function Page() {
  const role = await GetRole();
  return (
    <>
      {role === Role.teacher && <TeacherProfile/>}
      {role === Role.employee && <EmployeeProfile/>}
    </>
  )
}