import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AttendanceRecord } from '../../types'

interface AttendanceState {
  records: AttendanceRecord[]
  todayRecord: AttendanceRecord | null
  isLoading: boolean
  error: string | null
}

const initialState: AttendanceState = {
  records: [],
  todayRecord: null,
  isLoading: false,
  error: null
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchAttendanceSuccess: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.isLoading = false
      state.records = action.payload
    },
    fetchAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setTodayRecord: (state, action: PayloadAction<AttendanceRecord | null>) => {
      state.todayRecord = action.payload
    },
    addAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records.push(action.payload)
    },
    updateAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id)
      if (index !== -1) {
        state.records[index] = action.payload
      }
      if (state.todayRecord?.id === action.payload.id) {
        state.todayRecord = action.payload
      }
    }
  }
})

export const {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  setTodayRecord,
  addAttendanceRecord,
  updateAttendanceRecord
} = attendanceSlice.actions

export default attendanceSlice.reducer