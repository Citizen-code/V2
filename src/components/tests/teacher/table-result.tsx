'use client'
import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';

export default function TableResult({data}:{data:{name:string, value:number}[]}) {
  return (
    <ResponsiveContainer width={'100%'} height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey={"value"} unit={"%"} />
        <Tooltip contentStyle={{
          backgroundColor:"hsl(var(--background))"
        }}/>
        <Brush dataKey={"name"} height={30} stroke="#8884d8" fill='background'/>
        <Bar dataKey={"value"} name="Процент правильных ответов" unit={"%"} fill='#8884d8'/>
      </BarChart>
    </ResponsiveContainer>
  );
}
