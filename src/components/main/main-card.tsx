'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/navigation";

export function MainCard({ title, value, icon, helperText, className, }: { title: string; value: string; helperText: string; className: string; icon: ReactNode; }) {
  const {push} = useRouter();
  return (
    <Card className={cn(className, 'min-w-[350px]')}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <p className="text-xs text-muted-foreground pt-2">{helperText}</p>
        </div>
        {icon}
      </CardHeader>
      <CardContent className="flex justify-center pt-4">
        <Button className="gap-2 p-0" variant={'link'} onClick={() => push(value)}>Перейти <BsArrowRight /></Button>
      </CardContent>
    </Card>
  )
}