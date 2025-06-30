import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  type: 'leave' | 'attendance' | 'employee' | 'document'
  timestamp: Date
  status?: 'approved' | 'pending' | 'rejected'
}

const activities: Activity[] = [
  {
    id: '1',
    user: { name: 'John Doe' },
    action: 'Applied for sick leave',
    type: 'leave',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'pending'
  },
  {
    id: '2',
    user: { name: 'Sarah Wilson' },
    action: 'Checked in late',
    type: 'attendance',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '3',
    user: { name: 'Mike Johnson' },
    action: 'Uploaded ID document',
    type: 'document',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
  },
  {
    id: '4',
    user: { name: 'Emily Chen' },
    action: 'Profile updated',
    type: 'employee',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
]

const RecentActivities: React.FC = () => {
  const getActivityIcon = (type: string) => {
    const colors = {
      leave: 'bg-yellow-100 text-yellow-800',
      attendance: 'bg-green-100 text-green-800',
      employee: 'bg-blue-100 text-blue-800',
      document: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    
    const variants = {
      approved: 'success',
      pending: 'warning',
      rejected: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar
                fallback={activity.user.name.split(' ').map(n => n[0]).join('')}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user.name}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getActivityIcon(activity.type)}`}>
                    {activity.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{activity.action}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivities