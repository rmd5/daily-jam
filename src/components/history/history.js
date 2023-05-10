import { LinkOutlined, PlayCircleFilled, ShareAltOutlined, StarOutlined } from "@ant-design/icons"
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import copy from "copy-to-clipboard"

import "./history.sass"
import history from "../../history";

export default function History(props) {
    const user = useSelector(state => state.user.value)
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
            <div className="head">
                <div className="date">
                    {key}
                </div>
            </div>
            {value?.map(e => {
                let date = new Date(e.date)
                let day = date.getDate()
                let month = date.getMonth() + 1
                let year = date.getFullYear()
                return <div key={e?.spotify_id} className="history-item">
                    <div className="history-card" key={e?.spotify_id}>
                        <img className="image" src={e?.raw?.images?.[1]?.url} alt={e?.raw?.name} />
                        <div className="info">
                            <div className="date">{`${day}.${month}.${year}`}</div>
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
                            <div className="options">
                                {user ? <div className="button">
                                    <StarOutlined />
                                </div> : null}

                                <div className="button" onClick={() => {
                                    copy(window.location.origin + "/" + e?.spotify_id)
                                    setCopied(e?.spotify_id)
                                }}>
                                    {copied !== e?.spotify_id ? <LinkOutlined /> : <CheckIcon style={{ fontSize: "18px" }} />}
                                </div>

                                <div className="button">
                                    <ShareAltOutlined />
                                </div>

                                <PlayCircleFilled onClick={() => history.push("/" + e?.spotify_id)} className="play" />
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </div>
    })
}