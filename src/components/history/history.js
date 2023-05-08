import { PlayCircleFilled } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import "./history.sass"

export default function History(props) {
    const albums = useSelector(state => state.albums.history)
    const [categorized, setCatagorized] = useState({})

    useEffect(() => {
        categorize()
    }, [albums])

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    function categorize() {
        let monthly = {}
        for (let i = 0; i < albums?.length; i++) {
            let album = albums[i]

            let date = new Date(album?.date)
            let month = monthNames[date.getMonth()]
            let year = date.getFullYear()

            let key = `${month} ${year}`
            monthly[key] = monthly[key] ? [...monthly[key], album] : [album]
        }

        setCatagorized(monthly)
    }

    return Object.entries(categorized).map((e, n) => {
        let key = e[0]
        let value = e[1]

        return <div key={key} className="history">
            <div className="date">
                {key}
            </div>
            {value?.map(e => {
                let date = new Date(e.date)
                let day = date.getDate()
                return <div className="history-item">
                    <div className="item-key">
                        {day}
                    </div>
                    <div className="history-card" key={e?.spotify_id}>
                        <img className="image" src={e?.raw?.images?.[2]?.url} alt={e?.raw?.name} />
                        <div className="info">
                            <div className="album">{e?.raw?.name}</div>
                            <div className="artists">{e?.raw?.artists.map((artist, n) => {
                                if (e?.raw?.artists.length > 2) {
                                    if (n === e?.raw?.artists.length - 1) {
                                        return ` & ${artist.name}`
                                    } else if (n >= 1) {
                                        return `, ${artist.name}`
                                    }
                                    return artist.name
                                }
                                return artist.name
                            })}</div>
                        </div>
                        <PlayCircleFilled onClick={() => window.open(e.href, "_blank")} className="play" />
                    </div>
                </div>
            })}
        </div>
    })
}