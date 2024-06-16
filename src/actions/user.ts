'use server'
import prisma from "@/core/db";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth";
import { userSchemaType as userAddSchemaType } from "@/components/users/user-add";
import { userSchemaType as userEditSchemaType } from "@/components/users/user-edit";
const pages = 10;

export async function GetTestsStats() {
  const session = await getServerSession(authConfig)
  const data = await prisma.test.findMany({
    where: { author_id: session?.user?.id }, select: {_count: {select: { test_questions: true, test_result: true}}}
  })
  return {
    questions: data.reduce((sum, i) => sum + i._count.test_questions, 0),
    results: data.reduce((sum, i) => sum + i._count.test_result, 0),
  }
}

export async function GetPagesUsersList(search:string) {
  const count = Math.ceil(await prisma.employee.count({where:{
    OR:[
      {surname:{contains:search}},
      {name:{contains:search}},
      {patronymic:{contains:search}},
    ]
  }}) / pages);
  return count === 0 ? 1 : count
}

export async function GetUsersList(page:number, search:string) {
  return await prisma.employee.findMany({
    where:{
      OR:[
        {surname:{contains:search}},
        {name:{contains:search}},
        {patronymic:{contains:search}},
      ]
    },
    include:{employee_position:{include:{position:true}}, employee_level:{include:{level:true}}}, 
    skip: pages * (page - 1), take: pages})
}

export async function AddUser(params:userAddSchemaType) {
  await prisma.employee.create({data:{
    surname:params.surname,
    name:params.name,
    patronymic:params.patronymic,
    employee_level:{
      createMany:{data:params.employee_level.map(i => ({date:i.date, level_id:i.level_id}))}
    },
    employee_position:{
      createMany:{data:params.employee_position.map(i => ({position_id:i.position_id}))}
    },
  }, include:{employee_level:true, employee_position:true}})
}

export async function EditUser(params:userEditSchemaType, id:string) {
  await prisma.employee.update({where:{id:id}, data:{
    surname:params.surname,
    name:params.name,
    patronymic:params.patronymic,
    employee_level:{
      deleteMany:{employee_id:id},
      createMany:{data:params.employee_level.map(i => ({date:i.date, level_id:i.level_id}))}
    },
    employee_position:{
      deleteMany:{employee_id:id},
      createMany:{data:params.employee_position.map(i => ({position_id:i.position_id}))}
    },
  }, include:{employee_level:true, employee_position:true}})
}

export async function DeleteUser(id:string) {
  const action:any[] = []
  const results = await prisma.test_result.findMany({
    where:{employee_id:id},
  })
  for (let index = 0; index < results.length; index++) {
    const element = results[index];
    action.push(prisma.result_questions.deleteMany({
      where:{test_result:{id:element.id},},
    }))
    action.push(prisma.test_result.deleteMany({
      where:{id:element.id},
    }))
  }
  const tests = await prisma.test.findMany({
    where:{author_id:id},
  })
  for (let index = 0; index < tests.length; index++) {
    const element = tests[index];
    action.push(prisma.test_questions.deleteMany({
      where:{test:{id:element.id},},
    }))
    action.push(prisma.test.deleteMany({
      where:{id:element.id},
    }))
  }
  action.push(prisma.employee.update({
    where:{id},
    data:{
      employee_level:{deleteMany:{}},
      employee_position:{deleteMany:{},},
    }
  }))
  action.push(prisma.employee_credential.deleteMany({where:{employee_id:id}}))
  action.push(prisma.employee.delete({where:{id}}))
  await prisma.$transaction(action) 
}

export async function GetLevelsEmployee() {
  const session = await getServerSession(authConfig)
  if (session?.user?.id === undefined) throw new Error('Не авторизованный пользователь')
  return await prisma.employee_level.findMany({
    where:{employee_id:session.user.id},
    include:{level:true}
  })
}