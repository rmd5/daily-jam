import { createSlice } from '@reduxjs/toolkit'

export const albumsSlice = createSlice({
    name: 'albums',
    initialState: {
        recent: null,
        history: null,
    },
    reducers: {
        set: (state, action) => {
            state.recent = action.payload[0]
            state.history = action.payload
        }
    },
})

export const { set } = albumsSlice.actions

export default albumsSlice.reducer