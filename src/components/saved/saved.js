import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import history from "../../history"
import Embed from "../spotify/embed"

import "./saved.sass"

export default function Saved(props) {
    const saved = useSelector(state => state.saved.value)
    const albums = useSelector(state => state.albums.history)

    return <div className="saved">
        {saved?.length > 0 ? saved?.slice()?.sort((a, b) => new Date(a.date) - new Date(b.date))?.map(e => {
            return <div key={e?.album_id} className="saved-item">
                <Embed full={false} album={e?.daily_jam ? albums?.filter(f => f?.spotify_id === e?.album_id)[0] : e?.album} duration={props.duration} position={props.position} paused={props.paused} context={props.context} />
            </div>
        }) : <div className="no-saved">
            <div className="heading">
                Oops
            </div>
            <div className="subheading">
                Looks like you haven't saved any albums yet
            </div>
            <div className="cta" onClick={() => {
                history.push("/")
                props.setLocation("/")
            }}>
                Check out today's Jam
            </div>
            <br />
            <div className="cta" onClick={() => {
                history.push("/history")
                props.setLocation("/history")
            }}>
                Check out previous albums
            </div>
        </div>}
    </div>
}