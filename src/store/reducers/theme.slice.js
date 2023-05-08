import { createSlice } from '@reduxjs/toolkit'

const key = "dailyjam:theme"

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: localStorage.getItem(key) || "light"
    },
    reducers: {
        change: (state, action) => {
            localStorage.setItem(key, action.payload)
            state.value = action.payload
        }
    },
})

export const { change } = themeSlice.actions

export default themeSlice.reducer