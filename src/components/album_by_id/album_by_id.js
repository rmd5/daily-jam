import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import agent from "../../constants/agent"
import { set_loading } from "../../store/reducers/loading.slice"
import Home from "../home/home"

export default function AlbumById(props) {
    const user = useSelector(state => state.user.value)
    const albums = useSelector(state => state.albums?.history?.filter(e => e?.spotify_id === props.match.params.id))
    const [fetched, setFetched] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (albums !== undefined && albums.length > 0) {
            dispatch(set_loading(false))
        }
        if (albums !== undefined && albums.length === 0) {
            getAlbum()
        }
    }, [albums]) // eslint-disable-line react-hooks/exhaustive-deps

    async function getAlbum() {
        if (!fetched || fetched?.spotify_id !== props.match.params.id) {
            let [status, data, error] = await agent.get("/spotify/album/request", {}, { token: user?.token, album: props.match.params.id })

            if (status === 200) {
                setFetched(data)
                dispatch(set_loading(false))
            }

            if (error) {
                console.log(error)
            }
        }
    }

    return <Home full album={albums !== undefined && albums.length !== 0 ? albums[0] : fetched} duration={props.duration} position={props.position} paused={props.paused} context={props.context} />
}