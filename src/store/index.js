import { configureStore } from '@reduxjs/toolkit'
import albumsSlice from './reducers/albums.slice'
import loadingSlice from './reducers/loading.slice'
import playerSlice from './reducers/player.slice'
import storeReducer from "./reducers/store.slice"
import themeSlice from './reducers/theme.slice'
import userSlice from './reducers/user.slice'

export default configureStore({
    reducer: {
        store: storeReducer,
        theme: themeSlice,
        albums: albumsSlice,
        loading: loadingSlice,
        user: userSlice,
        player: playerSlice
    },
})