import React from "react"

export default function Embed(props) {
    let album = props.album
    return <div>
        <iframe
            style={{ borderRadius: "12px" }}
            src={album?.href}
            width="100%" height="380"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy" />
    </div>
}