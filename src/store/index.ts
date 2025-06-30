import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import organizationSlice from './slices/organizationSlice'
import employeeSlice from './slices/employeeSlice'
import attendanceSlice from './slices/attendanceSlice'
import leaveSlice from './slices/leaveSlice'
import dashboardSlice from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    organization: organizationSlice,
    employee: employeeSlice,
    attendance: attendanceSlice,
    leave: leaveSlice,
    dashboard: dashboardSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch