'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  return (
    <div className='flex flex-col min-h-screen min-w-full max-h-screen'>
      <div className="flex w-full h-full flex-col flex-grow items-center justify-center gap-4">
        <h2 className='text-destructive text-4xl'>Что-то пошло не так!</h2>
        <Button asChild>
          <Link href={'/'}>Вернуться на главную</Link>
        </Button>
      </div>
    </div>
  );
}
