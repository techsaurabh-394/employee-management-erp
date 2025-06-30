import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setTodayRecord, addAttendanceRecord } from '../store/slices/attendanceSlice'
import AttendanceCalendar from '../components/attendance/AttendanceCalendar'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Clock, MapPin, Calendar as CalendarIcon, Download } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const Attendance: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { todayRecord } = useSelector((state: RootState) => state.attendance)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handleClockIn = () => {
    const now = new Date()
    const newRecord = {
      id: Date.now().toString(),
      employeeId: user?.id || '',
      date: now,
      checkIn: now,
      status: 'present' as const,
      location: location ? {
        latitude: location.lat,
        longitude: location.lng,
        address: 'Current Location'
      } : undefined
    }

    dispatch(setTodayRecord(newRecord))
    dispatch(addAttendanceRecord(newRecord))
    toast.success('Successfully clocked in!')
  }

  const handleClockOut = () => {
    if (!todayRecord) return

    const now = new Date()
    const updatedRecord = {
      ...todayRecord,
      checkOut: now,
      workingHours: todayRecord.checkIn 
        ? (now.getTime() - todayRecord.checkIn.getTime()) / (1000 * 60 * 60)
        : 0
    }

    dispatch(setTodayRecord(updatedRecord))
    toast.success('Successfully clocked out!')
  }

  const isCheckedIn = todayRecord?.checkIn && !todayRecord?.checkOut
  const isCheckedOut = todayRecord?.checkIn && todayRecord?.checkOut

  // Mock attendance data for calendar
  const mockAttendanceData = {
    '2024-01-15': 'present',
    '2024-01-16': 'present',
    '2024-01-17': 'late',
    '2024-01-18': 'present',
    '2024-01-19': 'half_day',
    '2024-01-22': 'present',
    '2024-01-23': 'absent',
    '2024-01-24': 'present'
  } as const

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track your daily attendance and working hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Clock In/Out Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Time */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <div className="text-sm text-gray-600">
                {format(currentTime, 'EEEE, MMMM d, yyyy')}
              </div>
            </div>

            {/* Status */}
            <div className="text-center">
              {isCheckedOut ? (
                <Badge variant="secondary">Checked Out</Badge>
              ) : isCheckedIn ? (
                <Badge variant="success">Checked In</Badge>
              ) : (
                <Badge variant="outline">Not Checked In</Badge>
              )}
            </div>

            {/* Clock In/Out Buttons */}
            <div className="flex justify-center">
              {!isCheckedIn && !isCheckedOut && (
                <Button onClick={handleClockIn} className="w-32">
                  Clock In
                </Button>
              )}
              {isCheckedIn && (
                <Button onClick={handleClockOut} variant="destructive" className="w-32">
                  Clock Out
                </Button>
              )}
              {isCheckedOut && (
                <Button disabled className="w-32">
                  Day Complete
                </Button>
              )}
            </div>

            {/* Today's Record */}
            {todayRecord && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check In:</span>
                  <span className="font-medium">
                    {todayRecord.checkIn ? format(todayRecord.checkIn, 'HH:mm') : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check Out:</span>
                  <span className="font-medium">
                    {todayRecord.checkOut ? format(todayRecord.checkOut, 'HH:mm') : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Working Hours:</span>
                  <span className="font-medium">
                    {todayRecord.workingHours 
                      ? `${todayRecord.workingHours.toFixed(2)} hrs`
                      : '-'
                    }
                  </span>
                </div>
                {todayRecord.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>Location tracked</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Month's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-sm text-gray-600">Days Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-gray-600">Days Absent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-gray-600">Late Arrivals</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">165</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Calendar */}
      <AttendanceCalendar attendanceData={mockAttendanceData} />

      {/* Recent Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Recent Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - i)
              const status = i === 0 ? 'present' : i === 2 ? 'late' : i === 5 ? 'absent' : 'present'
              
              return (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <div className="font-medium">{format(date, 'MMM d, yyyy')}</div>
                      <div className="text-gray-500">{format(date, 'EEEE')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={status === 'present' ? 'success' : status === 'late' ? 'warning' : 'destructive'}
                    >
                      {status}
                    </Badge>
                    <div className="text-sm text-gray-600 min-w-[80px] text-right">
                      {status !== 'absent' ? '09:00 - 18:00' : '-'}
                    </div>
                    <div className="text-sm text-gray-600 min-w-[60px] text-right">
                      {status !== 'absent' ? '8.5 hrs' : '-'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Attendance