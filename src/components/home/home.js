import React from "react"
import { useSelector } from "react-redux"
import Embed from "../spotify/embed"

import "./home.sass"

export default function Home(props) {
	const album = useSelector(state => state.albums.recent)

    return <div className={`home`}>
        <Embed album={album} />
    </div>
}