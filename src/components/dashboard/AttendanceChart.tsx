import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tue', present: 78, absent: 22 },
  { day: 'Wed', present: 92, absent: 8 },
  { day: 'Thu', present: 87, absent: 13 },
  { day: 'Fri', present: 83, absent: 17 },
  { day: 'Sat', present: 45, absent: 55 },
  { day: 'Sun', present: 12, absent: 88 }
]

const AttendanceChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="present" fill="#3B82F6" name="Present" />
            <Bar dataKey="absent" fill="#EF4444" name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default AttendanceChart