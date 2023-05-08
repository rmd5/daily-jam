import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        value: true,
    },
    reducers: {
        set_loading: (state, action) => {
            state.value = action.payload
        }
    },
})

export const { set_loading } = loadingSlice.actions

export default loadingSlice.reducer