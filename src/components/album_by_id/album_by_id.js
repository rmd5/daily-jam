import React from "react"
import { useSelector } from "react-redux"
import Home from "../home/home"

export default function AlbumById(props) {
    const album = useSelector(state => state.albums?.history?.filter(e => e?.spotify_id === props.match.params.id)?.[0])

    return <Home album={album} duration={props.duration} position={props.position} paused={props.paused} context={props.context} />
}