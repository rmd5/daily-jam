import { createSlice } from '@reduxjs/toolkit'

export const savedSlice = createSlice({
    name: 'saved',
    initialState: {
        value: [],
    },
    reducers: {
        set_saved: (state, action) => {
            console.log(action.payload)
            state.value = action.payload
        },
        add_saved: (state, action) => {
            let new_state = state.value
            new_state.push(action.payload)
            state.value = new_state
        },
        remove_saved: (state, action) => {
            state.value = state.value.filter(e => e?.spotify_id !== action.payload)
        }
    },
})

export const { set_saved, add_saved, remove_saved } = savedSlice.actions

export default savedSlice.reducer