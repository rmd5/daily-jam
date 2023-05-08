import React from "react"
import { useSelector } from "react-redux"

import "./history.sass"

export default function History(props) {
    const albums = useSelector(state => state.albums.history)

    return albums?.map(e => {
        return <div className="history-item" key={e?.spotify_id}>
            <img className="image" src={e?.raw?.images?.[2]?.url} alt={e?.raw?.name} />
            <div className="info">
                <div className="album">{e?.raw?.name}</div>
                <div className="artists">{e?.raw?.artists.map((artist, n) => {
                    if (e?.raw?.artists.length > 2) {
                        if (n === e?.raw?.artists.length - 1) {
                            return ` & ${artist.name}`
                        } else if(n >= 1) {
                            return `, ${artist.name}`
                        }    
                        return artist.name
                    }
                    return artist.name
                })}</div>
            </div>
        </div>
    })
}