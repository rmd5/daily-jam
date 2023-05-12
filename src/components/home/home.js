import { LinkOutlined, ShareAltOutlined, StarOutlined } from "@ant-design/icons"
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Compact from "../spotify/compact"
import copy from "copy-to-clipboard"

import "./home.sass"

export default function Home(props) {
    const user = useSelector(state => state.user.value)
    const [album, setAlbum] = useState(props.album)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setAlbum(props.album)
    }, [props.album])

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 1000)
        }
    }, [copied])

    return <div className={`home`}>
        <Compact album={album} duration={props.duration} position={props.position} paused={props.paused} context={props.context} />
        {/* <div className="options">
            {user ? <div className="button">
                <StarOutlined />
            </div> : null}

            <div className="button" onClick={() => {
                copy(window.location.origin + "/" + album?.spotify_id)
                setCopied(true)
            }}>
                {!copied ? <LinkOutlined /> : <CheckIcon />}
            </div>

            <div className="button">
                <ShareAltOutlined />
            </div>
        </div> */}
    </div>
}