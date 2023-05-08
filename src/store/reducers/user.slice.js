import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        register: (state, action) => {
            state.value = action.payload
        }
    },
})

export const { register } = userSlice.actions

export default userSlice.reducer