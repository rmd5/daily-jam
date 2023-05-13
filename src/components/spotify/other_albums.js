import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import history from "../../history"
import { set_loading } from "../../store/reducers/loading.slice"

import "./other_albums.sass"

export default function OtherAlbums(props) {
    const [album, setAlbum] = useState(props.album)
    const dispatch = useDispatch()

    useEffect(() => {
        setAlbum(props.album)
    }, [props.album])

    return album?.other_albums?.length > 0 ? <div className="container">
        <div className="heading">Like what you hear?</div>
        <div className="subheading">More albums by this artist</div>
        <div className="other-albums">
            {album?.other_albums?.map(e => {
                if (e.id !== album?.spotify_id) {
                    return <div key={e.id} onClick={() => {
                        history.push("/" + e.id)
                        dispatch(set_loading(true))
                    }} className="item">
                        <img className="cover" alt={e.name} src={e.images[1].url} />
                        <div className="name">
                            {e.name}
                        </div>
                        <div className="tag">
                            {e.album_type}
                        </div>
                    </div>
                } else return null
            })}
        </div>
    </div> : null
}