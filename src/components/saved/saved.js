import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import history from "../../history"
import Embed from "../spotify/embed"

import "./saved.sass"

export default function Saved(props) {
    const saved = useSelector(state => state.saved.value)

    return <div className="saved">
        {saved?.length > 0 ? saved?.map(e => {
            return <div key={e?.spotify_id} className="saved-item">
                <Embed full={false} album={e} duration={props.duration} position={props.position} paused={props.paused} context={props.context} />
            </div>
        }) : <div className="no-saved">
            <div className="heading">
                Oops
            </div>
            <div className="subheading">
                Looks like you haven't saved any albums yet
            </div>
            <div className="cta" onClick={() => {
                history.push("/history")
                props.setLocation("/history")
            }}>
                Check out previous albums
            </div>
        </div>}
    </div>
}