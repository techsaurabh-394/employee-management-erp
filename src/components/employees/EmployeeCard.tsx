import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Employee } from '../../types'
import { Mail, Phone, MapPin, MoreVertical } from 'lucide-react'
import { getInitials, formatDate } from '../../lib/utils'

interface EmployeeCardProps {
  employee: Employee
  onView?: (employee: Employee) => void
  onEdit?: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'secondary'
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={employee.personalInfo.avatar}
              fallback={getInitials(`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`)}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {employee.personalInfo.firstName} {employee.personalInfo.lastName}
              </h3>
              <p className="text-sm text-gray-600">{employee.workInfo.designation}</p>
              <p className="text-xs text-gray-500">ID: {employee.employeeId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(employee.isActive)}>
              {employee.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{employee.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{employee.personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{employee.workInfo.workLocation}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Joined: {formatDate(employee.workInfo.joiningDate)}</span>
          <Badge variant="outline" className="text-xs">
            {employee.workInfo.shift}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView?.(employee)}>
            View
          </Button>
          <Button size="sm" onClick={() => onEdit?.(employee)}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeeCard