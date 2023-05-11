import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import agent from "../../constants/agent"
import player from "../../constants/player"
import { register } from "../../store/reducers/user.slice"
import ColorThief from '../../../node_modules/colorthief/dist/color-thief.mjs'

import "./embed.sass"

export default function Embed(props) {
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()
    const [album, setAlbum] = useState(props.album)

    useEffect(() => {
        setAlbum(props.album)
    }, [props.album])

    const [duration, setDuration] = useState(props.duration)
    const [position, setPosition] = useState(props.position)
    const [location, setLocation] = useState(duration - position)
    const [paused, setPaused] = useState(props.paused)
    const [context, setContext] = useState(null)
    const [refresh, setRefresh] = useState(false)

    const [color, setColor] = useState("")

    useEffect(() => {
        setContext(props.context)
        if (props.context?.uri !== album?.raw?.uri) {
            setRefresh(true)
        } else {
            setRefresh(false)
        }
    }, [props.context, album?.raw?.uri])

    useEffect(() => {
        if (props.context?.uri === album?.raw?.uri) {
            setDuration(props.duration)
        }
    }, [props.duration, props.context, album?.raw?.uri])

    useEffect(() => {
        if (props.context?.uri === album?.raw?.uri) {
            setPosition(props.position)
        }
    }, [props.position, props.context, album?.raw?.uri])

    useEffect(() => {
        if (props.context?.uri === album?.raw?.uri) {
            setPaused(props.paused)
        }
    }, [props.paused, props.context, album?.raw?.uri])

    useEffect(() => {
        if (props.context?.uri === album?.raw?.uri) {
            setLocation(props.duration - props.position)
        }
    }, [props.duration, props.position, props.context, album?.raw?.uri])

    useEffect(() => {
        let interval = 100
        let myInterval = setInterval(() => {
            if (!paused && !refresh) {
                setLocation(location - interval)
            }
        }, interval)
        return () => {
            clearInterval(myInterval);
        };
    }, [location, paused, refresh])


    const wrapInRefresh = async (func) => {
        let res = await func()
        if (res?.status === 401) {
            let token = user?.refresh_token || localStorage.getItem("dailyjam:refresh_token")
            let [res, data, ] = await agent.get("/spotify/auth/refresh", {}, { refresh_token: token })
            if (res === 200) {
                dispatch(register(data))

                let expires_in = new Date()
                expires_in.setSeconds(expires_in.getSeconds() + 3600)
                localStorage.setItem("dailyjam:token", JSON.stringify({
                    token: data.token,
                    expiry: expires_in
                }))

                setTimeout(() => {
                    console.log("OOCH")
                    spotify = player.token(data.token)
                    func()
                }, 1000)
            }
        }
    }

    let spotify = player.token(user?.token)
    const play_album = () => wrapInRefresh(() => spotify.play_album(album?.raw?.uri))
    const pause = () => wrapInRefresh(() => spotify.pause())
    const resume = () => wrapInRefresh(() => spotify.resume())
    // const seek = (pos) => wrapInRefresh(() => spotify.seek(pos))
    const skip = () => wrapInRefresh(() => spotify.skip())
    const prev = () => wrapInRefresh(() => spotify.previous())
    // const repeat = (state) => wrapInRefresh(() => spotify.repeat(state))

    function millisToMinutesAndSeconds(millis) {
        if (refresh) return "00:00"
        const date = new Date(millis);
        let seconds = date.getSeconds()
        let minutes = date.getMinutes()
        return `-${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    }

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')

    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        console.log(R, G, B)

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        R = Math.round(R)
        G = Math.round(G)
        B = Math.round(B)

        var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }

    useEffect(() => {
        if (album?.color) {
            setColor(album.color)
        }
        if (album?.raw?.images?.length > 0 && album && !album?.color) {
            console.log("GET")
            const colorThief = new ColorThief();
            const img = document.getElementById(album?.raw?.uri);

            if (img.complete) {
                let [r, g, b] = colorThief.getColor(img)
                let hex = shadeColor(rgbToHex(r, g, b), -20)
                setColor(hex)
                update_color(hex)
            } else {
                img.addEventListener('load', function () {
                    let [r, g, b] = colorThief.getColor(img)
                    let hex = shadeColor(rgbToHex(r, g, b), -20)
                    setColor(hex)
                    update_color(hex)
                })
            }
        }
    }, [album]) // eslint-disable-line react-hooks/exhaustive-deps

    async function update_color(hex) {
        let [status, data, error] = await agent.patch("/spotify/album/color", {}, {
            id: album?.spotify_id,
            color: hex
        })

        if (status !== 200) {
            console.log(error)
            return
        }

        console.log(status, data, error)

        let key = "dailyjam:albums"
        let albums = JSON.parse(localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(albums.map(e => {
            if (e.spotify_id === album?.spotify_id) {
                e = data
            }
            return e
        })))

        setAlbum(data)
    }

    return <>
        <div className="embed">
            <div className="album"
                // Disco mode
                // style={{ backgroundColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0') }}
                style={{ backgroundColor: color }}
            >
                <img id={album?.raw?.uri} className="cover" alt={album?.raw?.name} src={album?.raw?.images?.[1]?.url} crossOrigin="anonymous" />
                <svg className="spotify_logo"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm5.045 15.866a.686.686 0 0 1-.943.228c-2.583-1.579-5.834-1.935-9.663-1.06a.686.686 0 0 1-.306-1.337c4.19-.958 7.785-.546 10.684 1.226a.686.686 0 0 1 .228.943zm1.346-2.995a.858.858 0 0 1-1.18.282c-2.956-1.817-7.464-2.344-10.961-1.282a.856.856 0 0 1-1.11-.904.858.858 0 0 1 .611-.737c3.996-1.212 8.962-.625 12.357 1.462a.857.857 0 0 1 .283 1.179zm.116-3.119c-3.546-2.106-9.395-2.3-12.78-1.272a1.029 1.029 0 0 1-.597-1.969c3.886-1.18 10.345-.952 14.427 1.471a1.029 1.029 0 0 1-1.05 1.77z"></path></svg>
                <div className="info">
                    <div className="name">
                        {album?.raw?.name}
                    </div>
                    <div className="artist">
                        {album?.raw?.artists.map((artist, n) => {
                            if (album?.raw?.artists?.length > 2) {
                                if (n === album?.raw?.artists?.length - 1) {
                                    return ` & ${artist.name}`
                                } else if (n >= 1) {
                                    return `, ${artist.name}`
                                }
                                return artist.name
                            }
                            return artist.name
                        })}
                    </div>
                </div>
                <div className="player">
                    <div className="seek">
                        <svg onClick={context?.metadata?.previous_items?.length === 0 ? play_album : prev} className="prev"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path></svg>
                        <div className="seeker" style={{ background: refresh ? "" : `linear-gradient(90deg, #ffffff 0%, #ffffff ${100 / duration * (duration - location)}%, #ffffff4d ${100 / duration * (duration - location)}%, #ffffff4d 100%)` }}></div>
                        <svg onClick={skip} className="next"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path></svg>
                        <div className="timer">{location ? millisToMinutesAndSeconds(location) : "00:00"}</div>
                        {!props.paused && !refresh ?
                            <svg onClick={pause} className="play" viewBox="0 0 24 24"><path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7.5-5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2z"></path></svg>
                            : <svg onClick={context && !refresh ? resume : play_album} className="play" viewBox="0 0 24 24"><title>Play</title><path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.75-4.567a.5.5 0 0 0-.75.433v8.268a.5.5 0 0 0 .75.433l7.161-4.134a.5.5 0 0 0 0-.866L9.75 7.433z"></path></svg>}
                    </div>
                </div>
            </div>
            <div className="tracks">

            </div>
        </div>

        {/* <br />

        <iframe
            title={album?.raw?.name}
            style={{ borderRadius: "12px" }}
            src={album?.href}
            width="100%" height="380px"
            frameBorder="0"
            allowFullScreen={true}
            allow="encrypted-media"
            loading="lazy" /> */}
    </>

    // return 
}