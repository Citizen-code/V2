import authConfig from "@/core/auth-config"
import prisma from "@/core/db"
import { getServerSession } from "next-auth/next"

export enum Role {
  teacher = 1,
  employee = 2,
  admin = 3,
  undefined = -1,
}

export async function GetRole() {
  const session = await getServerSession(authConfig)
  const employee = await prisma.employee.findFirstOrThrow({ where: { id: session?.user?.id }, include: { employee_position: true } })
  if (employee.employee_position.findIndex(i => i.position_id === Role.admin) !== -1) return Role.admin
  else if (employee.employee_position.findIndex(i => i.position_id === Role.teacher) !== -1) return Role.teacher
  else if (employee.employee_position.findIndex(i => i.position_id === Role.employee) !== -1) return Role.employee
  else return Role.undefined
}