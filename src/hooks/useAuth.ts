import { useSelector } from 'react-redux'
import { RootState } from '../store'

export const useAuth = () => {
  const { user, token, isAuthenticated, permissions } = useSelector((state: RootState) => state.auth)

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const hasRole = (role: string) => {
    return user?.role === role
  }

  const hasAnyRole = (roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false
  }

  return {
    user,
    token,
    isAuthenticated,
    permissions,
    hasPermission,
    hasRole,
    hasAnyRole
  }
}