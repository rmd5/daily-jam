import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import agent from "../../constants/agent"
import player from "../../constants/player"
import { register } from "../../store/reducers/user.slice"
import ColorThief from 'colorthief'
import tinycolor from "tinycolor2"

import "./embed.sass"
import history from "../../history"
import FullEmbed from "./embeds/full"
import CompactEmbed from "./embeds/compact"

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
    const [dark, setDark] = useState(false)
    const [active, setActive] = useState(null)

    useEffect(() => {
        setContext(props.context)
        setActive(props.context?.metadata?.current_item?.uri)
        if (props.context?.uri !== album?.raw?.uri || props.context?.uri !== props.context?.metadata?.current_item?.group?.uri) {
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
    const play_album = () => wrapInRefresh(() => spotify.play_album(album?.raw?.uri))
    const play_track = (uri, n) => wrapInRefresh(() => spotify.play_track(album?.raw?.uri, n))
    const pause = () => wrapInRefresh(() => spotify.pause())
    const resume = () => wrapInRefresh(() => spotify.resume())
    const seek = (pos) => wrapInRefresh(() => spotify.seek(pos))
    const skip = () => wrapInRefresh(() => spotify.skip())
    const prev = () => wrapInRefresh(() => spotify.previous())
    // const repeat = (state) => wrapInRefresh(() => spotify.repeat(state))

    const [count, setCount] = useState(0)
    useEffect(() => {
        let interval = 100
        let myInterval = setInterval(() => {
            if (!paused && !refresh) {
                if (count !== 0 && count % interval === 0) {
                    setCount(0)
                    get_current()
                } else {
                    setCount(count + 1)
                    let new_location = location - interval - (interval / 100 * 9)
                    setLocation(new_location)
                    setPosition(duration - new_location)
                }
            }
        }, interval)
        return () => {
            clearInterval(myInterval);
        };
    }, [location, paused, refresh]) // eslint-disable-line react-hooks/exhaustive-deps

    async function get_current() {
        let current = await spotify.currently_playing()
        setLocation(duration - current)
        setPosition(current)
    }

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')

    useEffect(() => {
        if (album?.color) {
            setColor(album.color)
            if (tinycolor(album.color).getBrightness() < 70) {
                setDark(tinycolor(album.color).getBrightness())
            }
        }
        if (album?.raw?.images?.length > 0 && album && !album?.color) {
            const colorThief = new ColorThief();
            const img = document.getElementById(album?.raw?.uri);

            if (img.complete) {
                let [r, g, b] = colorThief.getPalette(img, 2)[1]
                let hex = shadeColor(rgbToHex(r, g, b), -20)
                setColor(hex)
                if (tinycolor(hex).getBrightness() < 70) {
                    setDark(tinycolor(hex).getBrightness())
                } else {
                    setDark(false)
                }
                if (history.location.pathname === "/" || history.location.pathname === "/history") {
                    update_color(hex)
                }
            } else {
                img.addEventListener('load', function () {
                    let [r, g, b] = colorThief.getPalette(img, 2)[1]
                    let hex = shadeColor(rgbToHex(r, g, b), -20)
                    setColor(hex)
                    if (tinycolor(hex).getBrightness() < 70) {
                        setDark(tinycolor(hex).getBrightness())
                    } else {
                        setDark(false)
                    }
                    if (history.location.pathname === "/" || history.location.pathname === "/history") {
                        update_color(hex)
                    }
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

    if (props.full) {
        return <div className="embed">
            <div className="overflow"></div>
            <FullEmbed
                full={props.full}
                album={album} context={context} color={color}
                play_album={play_album} prev={prev} skip={skip} pause={pause} resume={resume} seek={seek}
                duration={duration} position={position} location={location} paused={paused}
                setPosition={setPosition}
                refresh={refresh} />
            <Tracks
                album={album} active={active}
                dark={dark} color={color}
                paused={paused} resume={resume} pause={pause} play_track={play_track} />
        </div>
    } else {
        return <div className="embed">
            <div className="overflow"></div>
            <CompactEmbed
                album={album} context={context} color={color}
                play_album={play_album} prev={prev} skip={skip} pause={pause} resume={resume} seek={seek}
                duration={duration} position={position} location={location} paused={paused}
                setPosition={setPosition}
                refresh={refresh} />
            <Tracks
                album={album} active={active}
                dark={dark} color={color}
                paused={paused} resume={resume} pause={pause} play_track={play_track} />
        </div>
    }
}

function Tracks(props) {
    let {
        dark,
        active,
        album,
        color,
        paused,
        resume,
        pause,
        play_track
    } = props

    const [hover, setHover] = useState(null)

    return <div className="tracks" id="tracks" style={{ backgroundColor: dark || dark === 0 ? shadeColor(color, dark < 10 ? 150 : dark < 20 ? 100 : dark < 30 ? 50 : dark < 50 ? 25 : dark < 60 ? 15 : 10) : shadeColor(color, -10) }}>
        {album?.raw?.tracks?.items?.map((track, n) => {
            return <div onClick={active === track.uri ? paused ? resume : pause : () => play_track(track.uri, n)} onMouseOver={() => setHover(n)} onMouseOut={() => setHover(null)} key={n} className="track" style={{ backgroundColor: active === track.uri || hover === n ? dark || dark === 0 ? shadeColor(color, dark < 10 ? 300 : dark < 20 ? 200 : dark < 30 ? 100 : dark < 50 ? 50 : dark < 60 ? 30 : 20) : shadeColor(color, -20) : "" }}>
                <div className="num">
                    {active === track.uri ?
                        paused ? <svg viewBox="0 0 16 16" className="track_play"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
                            : <svg viewBox="0 0 16 16" className="track_pause"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
                        : hover === n ? <svg viewBox="0 0 16 16" className="track_play"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
                            : n + 1}
                </div>
                <div className="info">
                    <div className="title">
                        {track.name}
                    </div>
                    <div className="artists">
                        {track.artists.map((artist, n) => {
                            if (track.artists.length > 2) {
                                if (n === track.artists.length - 1) {
                                    return ` & ${artist.name}`
                                } else if (n >= 1) {
                                    return `, ${artist.name}`
                                }
                                return artist.name
                            } else if (track.artists.length === 2 && n === 1) {
                                return ` & ${artist.name}`
                            }
                            return artist.name
                        })}
                    </div>
                </div>
                <div className="time">
                    {millisToMinutesAndSeconds(track.duration_ms).slice(1)}
                </div>
            </div>
        })}
    </div>
}

function shadeColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R > 10 ? R : 10) * (100 + percent) / 100);
    G = parseInt((G > 10 ? G : 10) * (100 + percent) / 100);
    B = parseInt((B > 10 ? B : 10) * (100 + percent) / 100);

    R = Math.ceil(R)
    G = Math.ceil(G)
    B = Math.ceil(B)

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

function millisToMinutesAndSeconds(millis) {
    const date = new Date(millis);
    let seconds = date.getSeconds()
    let minutes = date.getMinutes()
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`
}