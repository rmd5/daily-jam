import { createSlice } from '@reduxjs/toolkit'

// Add and remove items from a global object store
export const storeSlice = createSlice({
    name: 'store',
    initialState: {
        value: {},
    },
    reducers: {
        add: (state, action) => {
            state.value = { ...state.value, ...action.payload }
        },
        remove: (state, action) => {
            let data = {...state.value}
            delete data[action.payload]
            state.value = data
        }
    },
})

export const { add, remove } = storeSlice.actions

export default storeSlice.reducer