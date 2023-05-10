import React from "react"
import { useSelector } from "react-redux"

export default function Embed(props) {
    const theme = useSelector((state) => state.theme.value)
    let album = props.album
    return <iframe
        title={album?.raw?.name}
        style={{ borderRadius: "12px" }}
        src={theme === "dark" ? album?.href + "&theme=0" : album?.href}
        width="100%" height="380"
        frameBorder="0"
        allowFullScreen={true}
        allow="encrypted-media"
        loading="lazy" />
}