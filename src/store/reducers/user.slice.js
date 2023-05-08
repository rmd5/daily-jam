import { createSlice } from '@reduxjs/toolkit'

let key = "dailyjam:user"

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: JSON.parse(sessionStorage.getItem(key))
    },
    reducers: {
        register: (state, action) => {
            sessionStorage.setItem(key, JSON.stringify(action.payload))
            state.value = action.payload
        }
    },
})

export const { register } = userSlice.actions

export default userSlice.reducer