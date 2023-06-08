import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import agent from "../../constants/agent"
import player from "../../constants/player"
import { register } from "../../store/reducers/user.slice"

import "./mini_player.sass"

export default function MiniPlayer(props) {
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()

    let {
        context,
        paused,
        duration,
        position
    } = props

    useEffect(() => {
        console.log(context)
    }, [context])

    const wrapInRefresh = async (func) => {
        let res = await func()
        if (res?.status === 401) {
            let token = user?.refresh_token || localStorage.getItem("dailyjam:refresh_token")
            let [res, data,] = await agent.get("/spotify/auth/refresh", {}, { refresh_token: token })
            console.log(res, data)
            if (res === 200) {
                dispatch(register(data))

                let expires_in = new Date()
                expires_in.setSeconds(expires_in.getSeconds() + 3600)
                localStorage.setItem("dailyjam:token", JSON.stringify({
                    token: data.token,
                    expiry: expires_in
                }))

                setTimeout(() => {
                    spotify = player.token(data.token)
                    func()
                }, 1000)
            }
        }
    }

    let spotify = player.token(user?.token)
    const pause = () => wrapInRefresh(() => spotify.pause())
    const resume = () => wrapInRefresh(() => spotify.resume())
    const skip = () => wrapInRefresh(() => spotify.skip())
    const prev = () => wrapInRefresh(() => spotify.previous())

    return context?.metadata?.current_item ? <div className="mini-player">
        <img className="cover" src={context?.metadata?.current_item?.images?.[1]?.url} alt={context?.metadata?.current_item?.name} />
        <div className="details">
            <div className="title">{context?.metadata?.current_item?.name}</div>
            <div className="artist">{context?.metadata?.current_item?.artists.map((artist, n) => {
                if (context?.metadata?.current_item?.artists?.length > 2) {
                    if (n === context?.metadata?.current_item?.artists?.length - 1) {
                        return ` & ${artist.name}`
                    } else if (n >= 1) {
                        return `, ${artist.name}`
                    }
                    return artist.name
                } else if (context?.metadata?.current_item?.artists?.length === 2 && n === 1) {
                    return ` & ${artist.name}`
                }
                return artist.name
            })}</div>
        </div>
        <div className="player">
            <div className="controls">
                <svg onClick={prev} className="prev" viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path></svg>

                {!paused ?
                    <svg className="pause" onClick={pause} viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                    : <svg className="play" onClick={resume} viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>}

                <svg onClick={skip} className="next" viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path></svg>
            </div>
        </div>
        <div className="seeker" style={{background: `linear-gradient(90deg, white 0%, white ${100 / duration * position}%, black ${100 / duration * position}%, black 100%)`}}></div>
    </div> : null
}