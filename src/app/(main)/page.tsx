import { GetRole, Role } from "@/utility/check-role";
import MainAdmin from "@/components/main/main-admin";
import MainEmployee from "@/components/main/main-employee";
import MainTeacher from "@/components/main/main-teacher";

export default async function Page() {
  const role = await GetRole();
  return (
    <>
      {role === Role.teacher && <MainTeacher/>}
      {role === Role.employee && <MainEmployee/>}
      {role === Role.admin && <MainAdmin/>}
    </>
  )
}