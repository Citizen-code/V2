'use client'
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RawExecute } from "@/actions/database";
import { Textarea } from "../ui/textarea";

export default function SqlExecute() {
  const [result, setResult] = useState<any|undefined>(undefined);
  const [sql, setSql] = useState('');

  const execute = async () => {
    setResult(await RawExecute(sql))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Запрос к базе данных</CardTitle>
      </CardHeader>
      <CardContent>
        <Input value={sql} onChange={(e) => setSql(e.target.value)} placeholder="SELECT * FROM 'table'" />
      </CardContent>
      <CardFooter className='flex flex-row-reverse'>
        <Button onClick={() => {
          execute()
        }}>Выполнить</Button>
      </CardFooter>
      {result && <CardFooter>
        <Textarea value={result} />
      </CardFooter>}
    </Card>)
}