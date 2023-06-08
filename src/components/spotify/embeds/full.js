import { HeartFilled, HeartOutlined, LinkOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react"
import CheckIcon from '@mui/icons-material/Check';
import copy from "copy-to-clipboard"
import { animated, useSpring } from '@react-spring/web'
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { add_saved, remove_saved } from "../../../store/reducers/saved.slice";
import agent from "../../../constants/agent";

export default function FullEmbed(props) {
    let {
        full,
        album,
        context,
        color,
        play_album,
        prev,
        skip,
        pause,
        resume,
        seek,
        duration,
        position,
        location,
        paused,
        setPosition,
        refresh
    } = props

    useEffect(() => {
        if (full && album?.raw?.uri) {
            resizeFunction()
            window.addEventListener('scroll', scrollFunction)
            window.addEventListener('resize', resizeFunction)
            return () => {
                window.removeEventListener("scroll", scrollFunction)
                window.removeEventListener('resize', resizeFunction)
            }
        }
    }, [full, album?.raw?.uri]) // eslint-disable-line react-hooks/exhaustive-deps

    function resizeFunction() {
        let cov = document.getElementById("shrink_cover")
        let cover = document.getElementById(album?.raw?.uri)

        if (cov && cover) {
            cov.style.height = cover.scrollWidth + "px"

            let details = document.getElementById("details")
            if (details) {
                details.style.top = (250 - (340 - cover.scrollWidth)) + "px"
            }
        }

        if (document.body.scrollTop <= 39 || document.documentElement.scrollTop <= 39) {
            if (window.innerWidth < 475) {
                let logo = document.getElementById("spotify_logo")
                if (logo) {
                    logo.style.top = "15px"
                    logo.style.right = "15px"
                }
            } else {
                let logo = document.getElementById("spotify_logo")
                if (logo) {
                    logo.style.top = "0px"
                    logo.style.right = "0px"
                }
            }
        }
    }

    const [mobile, setMobile] = useState(true)

    useEffect(() => {
        const userAgent =
            typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobile = Boolean(
            userAgent.match(
                /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
            )
        );
        setMobile(mobile);
    }, [navigator.userAgent])

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 1000)
        }
    }, [copied])

    const saved = useSelector(state => state.saved.value.filter(e => e?.album_id === album?.spotify_id).length === 1)
    const user = useSelector(state => state.user.value)
    const inHistory = useSelector(state => state.albums.history?.filter(e => e.spotify_id === album?.spotify_id).length === 1)
    const dispatch = useDispatch()

    async function SaveAlbum() {
        console.log(inHistory)
        let [status, data,] = await agent.post("/saved/add", {}, {
            user_id: user?.spotify_id,
            album_id: album?.spotify_id,
            daily_jam: inHistory,
            album: album
        })

        if (status === 200) {
            dispatch(add_saved(data))
        }
    }

    async function DeleteAlbum() {
        let [status, data,] = await agent.delete("/saved/delete", {}, {
            user_id: user?.spotify_id,
            album_id: album?.spotify_id
        })

        console.log(status, data)

        if (status === 200) {
            dispatch(remove_saved(album?.album_id))
        }
    }

    const [open, toggle] = useState(false)
    const spring = useSpring({ maxWidth: open ? 200 : 340, config: { duration: open ? 100 : 80 } })

    function scrollFunction() {
        if (document.body.scrollTop > 39 || document.documentElement.scrollTop > 39) {
            let amount = 340 - (document.documentElement.scrollTop - 39)
            if (amount < 200) amount = 200

            let shrink = document.getElementById(album?.raw?.uri)
            if (shrink) {
                shrink.style.transform = `translate(-50%,-${(340 - amount) * 0.5}px)scale(${amount / 340})`
            }

            if (window.innerWidth < 475) {
                let logo = document.getElementById("spotify_logo")
                if (logo) {
                    if (logo.style.top !== "0px") {
                        logo.style.top = "0px"
                        logo.style.right = "0px"
                    }
                }
            }
        } else {
            let shrink = document.getElementById(album?.raw?.uri)
            if (shrink) {
                shrink.style.transform = `translate(-50%,0px)`
            }

            let logo = document.getElementById("spotify_logo")
            if (logo) {
                if (window.innerWidth < 475 && logo.style.top !== "15px" && logo.style.top !== "") {
                    logo.style.top = "15px"
                    logo.style.right = "15px"
                }
            }
        }
    }

    return <>
        <div className="container" style={{ backgroundColor: color }}>
            <div className="full" id="full">
                <animated.div id="shrink_cover" className="cover_container">
                    <img className="cover" id={album?.raw?.uri} alt={album?.raw?.name} src={album?.raw?.images?.[1]?.url} crossOrigin="anonymous" />
                    <div className="link_group" id="spotify_logo">
                        <div onClick={() => {
                            window.open("https://open.spotify.com/album/" + album?.spotify_id)
                        }}>
                            <svg className="spotify_logo"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm5.045 15.866a.686.686 0 0 1-.943.228c-2.583-1.579-5.834-1.935-9.663-1.06a.686.686 0 0 1-.306-1.337c4.19-.958 7.785-.546 10.684 1.226a.686.686 0 0 1 .228.943zm1.346-2.995a.858.858 0 0 1-1.18.282c-2.956-1.817-7.464-2.344-10.961-1.282a.856.856 0 0 1-1.11-.904.858.858 0 0 1 .611-.737c3.996-1.212 8.962-.625 12.357 1.462a.857.857 0 0 1 .283 1.179zm.116-3.119c-3.546-2.106-9.395-2.3-12.78-1.272a1.029 1.029 0 0 1-.597-1.969c3.886-1.18 10.345-.952 14.427 1.471a1.029 1.029 0 0 1-1.05 1.77z"></path></svg>
                        </div>
                        <div className="link_icon" onClick={() => {
                            if (saved) {
                                DeleteAlbum()
                            } else {
                                SaveAlbum()
                            }
                        }}>
                            {!saved ? <HeartOutlined /> : <HeartFilled />}
                        </div>
                        <div className="link_icon" onClick={() => {
                            copy(window.location.origin + "/" + album?.spotify_id)
                            setCopied(true)
                        }}>
                            {!copied ? <LinkOutlined /> : <CheckIcon />}
                        </div>
                    </div>
                </animated.div>
            </div>
        </div>
        <div className="details" id="details" style={{ backgroundColor: color }}>
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
                        } else if (album?.raw?.artists?.length === 2 && n === 1) {
                            return ` & ${artist.name}`
                        }
                        return artist.name
                    })}
                </div>
            </div>
            <FullPlayer
                context={context}
                play_album={play_album} prev={prev} skip={skip} pause={pause} resume={resume} seek={seek}
                duration={duration} position={position} location={location} paused={paused}
                setPosition={setPosition}
                refresh={refresh} />
        </div>
    </>
}

function FullPlayer(props) {
    let {
        context,
        play_album,
        prev,
        skip,
        pause,
        resume,
        seek,
        duration,
        position,
        paused,
        setPosition,
        refresh
    } = props

    const [seeker, setSeek] = useState(false)

    return <div className="player">
        <div className="seek">
            <div className="controls">
                <svg onClick={context?.metadata?.previous_items?.length === 0 ? play_album : prev} className="prev" viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path></svg>

                {!paused && !refresh ?
                    <svg onClick={pause} className="play" viewBox="0 0 24 24"><path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7.5-5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2z"></path></svg>
                    : <svg onClick={context && !refresh ? resume : () => {
                        setPosition(0)
                        play_album()
                    }} className="play" viewBox="0 0 24 24"><title>Play</title><path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.75-4.567a.5.5 0 0 0-.75.433v8.268a.5.5 0 0 0 .75.433l7.161-4.134a.5.5 0 0 0 0-.866L9.75 7.433z"></path></svg>}

                <svg onClick={skip} className="next" viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path></svg>
            </div>

            <div className="timer">
                <div className="left">{position ? refresh ? "00:00" : millisToMinutesAndSeconds(position) : "00:00"}</div>
                <div className="right">{duration ? refresh ? "00:00" : millisToMinutesAndSeconds(duration) : "00:00"}</div>
            </div>

            <input
                onChange={(e) => {
                    setSeek(e.currentTarget.value)
                }}
                onMouseUp={async () => {
                    await seek(seeker)
                    setPosition(seeker)
                    setSeek(false)
                }}
                onTouchEnd={async () => {
                    await seek(seeker)
                    setPosition(seeker)
                    setSeek(false)
                }}
                style={{
                    background: refresh ? "" : `linear-gradient(90deg, white 0%, white ${100 / duration * (seeker || position)}%, #ffffff4d ${100 / duration * (seeker || position)}%, #ffffff4d 100%)`
                }}
                disabled={refresh} className="seeker" type="range"
                min={0} max={duration} value={!seeker ? !refresh ? position : 0 : seeker} />
        </div>
    </div>
}

function millisToMinutesAndSeconds(millis) {
    const date = new Date(parseInt(millis));
    let seconds = date.getSeconds()
    let minutes = date.getMinutes()
    if (isNaN(minutes)) console.log(millis, date)
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`
}