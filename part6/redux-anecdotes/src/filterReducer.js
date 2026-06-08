import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      return action.payload // RTK uses 'payload' by default for the data sent
    },
  },
})

// RTK automatically creates the action creators for you!
export const { filterChange } = filterSlice.actions
export default filterSlice.reducer