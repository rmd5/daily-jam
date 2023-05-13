import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import "./related.sass"

export default function Related(props) {
    const [album, setAlbum] = useState(props.album)
    const dispatch = useDispatch()

    useEffect(() => {
        setAlbum(props.album)
    }, [props.album])

    return album?.similar_artists?.length > 0 ? <div className="container">
        <div className="heading">
            Want to explore more?
        </div>
        <div className="subheading">
            More artists like this one
        </div>
        <div className="related">
            {album?.similar_artists?.map(e => {
                if (e.images.length > 0) {
                    return <div className="item" key={e.id}>
                        <img className="cover" src={e.images[1]?.url} alt={e.name} />
                        <div className="name">
                            {e.name}
                        </div>
                        <div className="tag">
                            artist
                        </div>
                    </div>
                }
            })}
        </div>
    </div> : null
}