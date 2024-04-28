'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({error}:{error:Error}) {
    useEffect(() => console.log(error),[error])
    return (
        <div className="flex w-full h-full flex-col flex-grow items-center justify-center gap-4">
            <h2 className='text-destructive text-4xl'>Что-то пошло не так!</h2>
            <Button asChild>
                <Link href={'/'}>Вернуться на главную</Link>
            </Button>
        </div>
    );
  }
  