import prisma from "@/core/db";
import EmployeeTests from "@/components/tests/employee/employee-tests";

export default async function Home() {
  return (
    <EmployeeTests levels={await prisma.level.findMany()} categories={await prisma.category.findMany()}/>
  );
}
