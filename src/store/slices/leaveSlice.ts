import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Leave } from '../../types'

interface LeaveState {
  leaves: Leave[]
  isLoading: boolean
  error: string | null
}

const initialState: LeaveState = {
  leaves: [],
  isLoading: false,
  error: null
}

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    fetchLeavesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchLeavesSuccess: (state, action: PayloadAction<Leave[]>) => {
      state.isLoading = false
      state.leaves = action.payload
    },
    fetchLeavesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    addLeave: (state, action: PayloadAction<Leave>) => {
      state.leaves.push(action.payload)
    },
    updateLeave: (state, action: PayloadAction<Leave>) => {
      const index = state.leaves.findIndex(leave => leave.id === action.payload.id)
      if (index !== -1) {
        state.leaves[index] = action.payload
      }
    }
  }
})

export const {
  fetchLeavesStart,
  fetchLeavesSuccess,
  fetchLeavesFailure,
  addLeave,
  updateLeave
} = leaveSlice.actions

export default leaveSlice.reducer