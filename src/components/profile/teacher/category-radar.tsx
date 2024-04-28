'use client'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function CategoryRadar({data}:{data:any}) {
  return (
  <ResponsiveContainer width={'100%'} height={500}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar name="Category" dataKey="A" stroke="#818cf8" fill="#818cf8 " fillOpacity={0.6} />
    </RadarChart>
  </ResponsiveContainer>
  )
}