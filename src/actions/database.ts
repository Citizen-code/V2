'use server'

import prisma from "@/core/db"

export async function RawExecute(params:string) {
  try{
    return JSON.stringify(await prisma.$queryRawUnsafe(params), null, 2)
  }catch(e){
    return JSON.stringify(e, null, 2)
  }
}