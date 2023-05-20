import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import "./history.sass"
import Embed from "../spotify/embed";

export default function History(props) {
    const albums = useSelector(state => state.albums.history)
    const [categorized, setCatagorized] = useState({})
    const [copied, setCopied] = useState(null)

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(null)
            }, 1000)
        }
    }, [copied])

    useEffect(() => {
        categorize()
    }, [albums]) // eslint-disable-line react-hooks/exhaustive-deps

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    function categorize() {
        let monthly = {}
        for (let i = 1; i < albums?.length; i++) {
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
                return <div key={e?.spotify_id} className="history-item">
                    <Embed full={false} album={e} duration={props.duration} position={props.position} paused={props.paused} context={props.context} />
                </div>
            })}
        </div>
    })
}