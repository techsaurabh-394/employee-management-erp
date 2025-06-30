import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Organization } from '../../types'

interface OrganizationState {
  organizations: Organization[]
  currentOrganization: Organization | null
  isLoading: boolean
  error: string | null
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  isLoading: false,
  error: null
}

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    fetchOrganizationsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchOrganizationsSuccess: (state, action: PayloadAction<Organization[]>) => {
      state.isLoading = false
      state.organizations = action.payload
    },
    fetchOrganizationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setCurrentOrganization: (state, action: PayloadAction<Organization>) => {
      state.currentOrganization = action.payload
    },
    addOrganization: (state, action: PayloadAction<Organization>) => {
      state.organizations.push(action.payload)
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      const index = state.organizations.findIndex(org => org.id === action.payload.id)
      if (index !== -1) {
        state.organizations[index] = action.payload
      }
      if (state.currentOrganization?.id === action.payload.id) {
        state.currentOrganization = action.payload
      }
    }
  }
})

export const {
  fetchOrganizationsStart,
  fetchOrganizationsSuccess,
  fetchOrganizationsFailure,
  setCurrentOrganization,
  addOrganization,
  updateOrganization
} = organizationSlice.actions

export default organizationSlice.reducer