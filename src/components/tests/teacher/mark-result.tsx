'use client'
import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';

export default function MarkResult({data}:{data:{name:string,value:number}[]}) {

  return (
<ResponsiveContainer width={'100%'} height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey={"value"} />
        <Tooltip contentStyle={{
          backgroundColor:"hsl(var(--background))"
        }}/>
        <Bar dataKey={"value"} name="Количество людей получивших оценку" fill='#8884d8'/>
      </BarChart>
    </ResponsiveContainer>
  );
}
