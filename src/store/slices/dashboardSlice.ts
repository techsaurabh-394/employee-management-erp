import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardStats } from '../../types'

interface DashboardState {
  stats: DashboardStats
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: {
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    newHires: 0,
    pendingLeaves: 0,
    upcomingBirthdays: 0
  },
  isLoading: false,
  error: null
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStatsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchStatsSuccess: (state, action: PayloadAction<DashboardStats>) => {
      state.isLoading = false
      state.stats = action.payload
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    }
  }
})

export const { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } = dashboardSlice.actions
export default dashboardSlice.reducer