import TeacherTests from "@/components/tests/teacher/teacher-tests";
import { getServerSession } from "next-auth";
import authConfig from "@/core/auth-config";
import prisma from "@/core/db";

export default async function Home() {
  return (
    <TeacherTests levels={await prisma.level.findMany()} categories={await prisma.category.findMany()} type={true}/>
  );
}
