import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { fetchStatsSuccess } from '../store/slices/dashboardSlice'
import StatsCard from '../components/dashboard/StatsCard'
import AttendanceChart from '../components/dashboard/AttendanceChart'
import RecentActivities from '../components/dashboard/RecentActivities'
import { Users, Clock, Calendar, UserPlus, AlertCircle, Gift } from 'lucide-react'

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { stats } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    // Mock data for demonstration
    dispatch(fetchStatsSuccess({
      totalEmployees: 247,
      presentToday: 198,
      onLeave: 12,
      newHires: 8,
      pendingLeaves: 15,
      upcomingBirthdays: 5
    }))
  }, [dispatch])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your organization today.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday}
          change="80% attendance"
          changeType="positive"
          icon={Clock}
        />
        <StatsCard
          title="On Leave"
          value={stats.onLeave}
          change="5% of workforce"
          changeType="neutral"
          icon={Calendar}
        />
        <StatsCard
          title="New Hires"
          value={stats.newHires}
          change="This month"
          changeType="positive"
          icon={UserPlus}
        />
        <StatsCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          change="Needs approval"
          changeType="neutral"
          icon={AlertCircle}
        />
        <StatsCard
          title="Birthdays"
          value={stats.upcomingBirthdays}
          change="This week"
          changeType="neutral"
          icon={Gift}
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <RecentActivities />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add Employee</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Apply Leave</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="h-8 w-8 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Clock In/Out</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <span className="text-sm font-medium text-gray-700">View Alerts</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard