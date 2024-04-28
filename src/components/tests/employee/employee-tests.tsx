import { Separator } from "@/components/ui/separator";
import TestSearch from "./test-search";
import prisma from "@/core/db";

export default async function EmployeeTests() {
  return (
    <div className="container pt-4">
    <div className='flex justify-between'>
      <h2 className="text-4xl font-bold col-span-2">Тестирования</h2>
    </div>
    <Separator className="my-6" />
    <TestSearch categories={await prisma.category.findMany()} />
  </div>
  )
}