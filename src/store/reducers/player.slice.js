import { createSlice } from '@reduxjs/toolkit'

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
        device: null,
        duration: 0,
        position: 0,
        paused: true,
        context: {}
    },
    reducers: {
        store_device: (state, action) => {
            state.device = action.payload
        },
        update_duration: (state, action) => {
            state.duration = action.payload
        },
        update_position: (state, action) => {
            state.duration = action.payload
        },
        update_paused: (state, action) => {
            state.duration = action.payload
        },
        update_context: (state, action) => {
            state.duration = action.payload
        }
    },
})

export const { store_device, update_duration, update_position, update_paused, update_context } = playerSlice.actions

export default playerSlice.reducer