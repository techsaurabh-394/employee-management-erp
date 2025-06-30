import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { cn } from '../../lib/utils'

interface AttendanceCalendarProps {
  attendanceData?: Record<string, 'present' | 'absent' | 'half_day' | 'late' | 'holiday'>
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ attendanceData = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getAttendanceStatus = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return attendanceData[dateKey] || null
  }

  const getStatusColor = (status: string | null, date: Date) => {
    if (isToday(date)) {
      return 'ring-2 ring-blue-500'
    }
    
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'half_day': return 'bg-yellow-100 text-yellow-800'
      case 'late': return 'bg-orange-100 text-orange-800'
      case 'holiday': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => {
            const status = getAttendanceStatus(day)
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'aspect-square flex items-center justify-center text-sm rounded-md cursor-pointer hover:bg-gray-100',
                  getStatusColor(status, day),
                  !isSameMonth(day, currentDate) && 'opacity-30'
                )}
              >
                {format(day, 'd')}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>Half Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 rounded"></div>
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Holiday</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceCalendar