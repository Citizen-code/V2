'use server'
import prisma from "@/core/db";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth";

export async function GetTestsStats() {
  const session = await getServerSession(authConfig)
  const data = await prisma.test.findMany({
    where: { author_id: session?.user?.id }, select: {_count: {select: { test_visited: true, test_questions: true, test_result: true}}}
  })
  return {
    visits: data.reduce((sum, i) => sum + i._count.test_visited, 0),
    questions: data.reduce((sum, i) => sum + i._count.test_questions, 0),
    results: data.reduce((sum, i) => sum + i._count.test_result, 0),
  }
}