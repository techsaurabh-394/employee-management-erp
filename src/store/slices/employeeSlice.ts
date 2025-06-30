import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Employee } from '../../types'

interface EmployeeState {
  employees: Employee[]
  selectedEmployee: Employee | null
  isLoading: boolean
  error: string | null
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchEmployeesSuccess: (state, action: PayloadAction<Employee[]>) => {
      state.isLoading = false
      state.employees = action.payload
    },
    fetchEmployeesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    selectEmployee: (state, action: PayloadAction<Employee>) => {
      state.selectedEmployee = action.payload
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload)
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id)
      if (index !== -1) {
        state.employees[index] = action.payload
      }
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload)
    }
  }
})

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  selectEmployee,
  addEmployee,
  updateEmployee,
  removeEmployee
} = employeeSlice.actions

export default employeeSlice.reducer