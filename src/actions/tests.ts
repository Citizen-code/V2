'use server'
import prisma from '@/core/db'
import type { testSchemaType } from '@/components/tests/teacher/create-test-button'
import Fuse from 'fuse.js'
import type { test, test_public, test_questions, result_questions, Prisma } from '@prisma/client'
import { text } from 'stream/consumers'
import authConfig from '@/core/auth-config'
import { getServerSession } from 'next-auth/next'
import { SearchSchemaType as TeacherSearchSchemaType } from '@/components/tests/teacher/teacher-tests'
import { SearchSchemaType as EmployeeSearchSchemaType } from '@/components/tests/employee/employee-tests'
import { SearchSchemaType as EmployeeSearchExamsSchemaType } from '@/components/tests/employee/employee-exams'

const fuseOptions = {
  // ignoreLocation: true,
  // threshold: 0.3,
  // fieldNormWeight: 2,
  keys: [
    "test.name",
  ]
};

export async function CreateTest({ values }: { values: testSchemaType }) {
  const session = await getServerSession(authConfig)
  if (session?.user?.id === undefined) throw new Error('Не авторизованный пользователь')
  values.author_id = session?.user?.id
  return await prisma.test.create({ data: { ...values }, include: { test_questions: true } })
}

export async function UpdateTest({ id, elements }: { id: string, elements: test_questions[] }) {
  await prisma?.test_questions.deleteMany({ where: { test_id: id } })
  for (let index = 0; index < elements.length; index++) {
    const el = elements[index];
    await prisma?.test_questions.create({ data: { id: el.id, test_id: id, type_id: el.type_id, question: el.question!, answers: el.answers! } })
  }
}

export async function PublishTest({ id }: { id: string }) {
  return await prisma.test_public.create({ data: { test_id: id } })
}

export async function GetEmployeeExams(params: EmployeeSearchExamsSchemaType) {
  const session = await getServerSession(authConfig)
  const employee = await prisma.employee.findFirstOrThrow({ where: { id: session?.user?.id }, include:{employee_level:true} })
  return await prisma.test_public.findMany({
    where: {
      test: {
        name: { contains: params.text },
        category_id: params.category_id === -1 ? undefined : params.category_id,
        AND: [
          { level_id: params.level_id === -1 ? undefined : params.level_id },
          { level_id: params.is_access ? undefined : (employee.employee_level.length === 0 ? {lte:1} : {lte:(Math.max(...(employee.employee_level.map(i => i.level_id))) + 1)}) }],
        type_id: params.type_id === -1 ? undefined : params.type_id,
        test_result: { every: { employee_id: session?.user?.id } },
      }
    },
    include: {
      test: {
        include: {
          category: true, level: true, employee: true, test_result: { include: { _count: { select: { result_questions: true } }, result_questions: true } },
          _count: { select: { test_visited: true, test_questions: true, test_result: true } }
        }
      },
    }
  }
  )
}

export async function GetEmployeeTests(params: EmployeeSearchSchemaType) {
  const session = await getServerSession(authConfig)
  return await prisma.test_public.findMany({
    where: {
      test: {
        name: { contains: params.text },
        category_id: params.category_id === -1 ? undefined : params.category_id,
        level_id: params.level_id === -1 ? undefined : params.level_id,
        type_id: params.type_id === -1 ? undefined : params.type_id,
        test_result: {
          every: {
            employee_id: session?.user?.id,
          }
        }
      }
    },
    include: {
      test: {
        include: {
          category: true, level: true, employee: true, test_result: { include: { _count: { select: { result_questions: true } }, result_questions: true } },
          _count: { select: { test_visited: true, test_questions: true, test_result: true } }
        }
      },
    }
  }
  )
  // const fuse = new Fuse(result, fuseOptions);
  // return params.text ? fuse.search(params.text).map(i => i.item) : result
}


export async function GetTeacherTests(params: TeacherSearchSchemaType) {
  const session = await getServerSession(authConfig)
  return await prisma.test.findMany({ where: { name: { contains: params.text }, AND: [{ test_public: params.public_view ? undefined : null }, { test_public: params.draft_view ? undefined : { isNot: null } }], author_id: session?.user?.id, category_id: params.category_id === -1 ? undefined : params.category_id, level_id: params.level_id === -1 ? undefined : params.level_id, type_id: params.type_id === -1 ? undefined : params.type_id }, include: { category: true, level: true, test_public: true, _count: { select: { test_result: true, test_visited: true, test_questions: true } } } })
}

export async function CreateNewPassing(id: string) {
  const session = await getServerSession(authConfig)
  if (session?.user === undefined) throw new Error('Не авторизован')
  const result = await prisma.test_result.create({ data: { test_id: id, employee_id: session.user.id } })
  return result.id;
}

export async function IsNewLevel(level_id:number) {
  const session = await getServerSession(authConfig)
  if (session?.user === undefined) throw new Error('Не авторизован')
  const result = await prisma.test_public.findMany({
    where:{test:{
      type_id:2, level_id
    }},
    include:{
      test:{
        include:{
          _count:{
            select:{
              test_questions:true,
            }
          },
          test_result:{
            include:{
              _count:{
                select:{
                  result_questions:{
                    where:{
                      is_correct:true,
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  if(result.length !== result.filter(i => i.test.test_result.findIndex(y => y._count.result_questions / i.test._count.test_questions * 100 >= 90) !== -1).length) return undefined
  else return await prisma.employee_level.create({data:{employee_id:session.user.id, level_id}, include:{level:true}})
}


export async function PassingQuestion(result_questions: result_questions) {
  const { is_correct, result_id, question_id } = result_questions;
  const answer = (result_questions.answer as Prisma.InputJsonValue)
  return await prisma.result_questions.create({ data: { is_correct, answer: answer, result_id, question_id } })
}
