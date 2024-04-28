'use server'
import prisma from '@/core/db'
import type { testSchemaType } from '@/components/tests/teacher/create-test-button'
import Fuse from 'fuse.js'
import type { test, test_public, test_questions } from '@prisma/client'
import { SearchSchemaType } from '@/components/tests/employee/test-search'
import { text } from 'stream/consumers'

const fuseOptions = {
	// ignoreLocation: true,
  // threshold: 0.3,
  // fieldNormWeight: 2,
	keys: [
		"test.name",
	]
};

export async function CreateTest({ values }: { values: testSchemaType }) {
  return await prisma.test.create({data: { ...values }, include: {test_questions: true}})
}

export async function UpdateTest({ id, elements }: { id: string, elements: test_questions[] }) {
  await prisma?.test_questions.deleteMany({where:{test_id:id}})
  for (let index = 0; index < elements.length; index++) {
    const el = elements[index];
    await prisma?.test_questions.create({data:{id:el.id, test_id:id, type_id:el.type_id, question:el.question!, answers:el.answers!}})
  }
}

export async function PublishTest({ id }: { id: string }) {
  return await prisma.test_public.create({data:{test_id:id}})
}

export async function GetEmployeeTests(params:SearchSchemaType) {
  const result = await prisma.test_public.findMany({where:{test:{category:{id:params.category_id}}},include:{test:{include:{category:true, level:true, test_visited:true}}}})
  const fuse = new Fuse(result, fuseOptions);
  return params.text ? fuse.search(params.text).map(i => i.item) : result
}