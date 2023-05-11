import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import agent from "../../constants/agent"
import history from "../../history"
import { register } from "../../store/reducers/user.slice"
import Loading from "../loading/loading"

import spotify from "../../assets/spotify-logo.png"
import symbol from "../../assets/spotify-btn.png"

import "./login.sass"

export default function Login(props) {
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        login()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    const scope = "streaming app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private"
    // let redirect_url = `https://accounts.spotify.com/authorize?response_type=code&scope=${scope}&state=990&client_id=${process.env.REACT_APP_CLIENT_ID}&redi`

    async function open_login() {
        window.location.href = `${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${scope}`
    }

    function login() {
        let key = "dailyjam:token"
        let user_key = "dailyjam:user"

        let stored_token_obj = JSON.parse(localStorage.getItem(key))
        let stored_token = stored_token_obj?.token
        let expiry = stored_token_obj?.expiry

        let today = new Date()
        if (new Date(expiry) < today) {
            localStorage.removeItem(key)
            sessionStorage.removeItem(user_key)
            open_login()
            return
        }

        const hash = window.location.search
        let code = hash?.substring(1)?.split("&")?.find(elem => elem.startsWith("code"))?.split("=")[1]

        let expires_in = new Date()
        expires_in.setSeconds(expires_in.getSeconds() + 3600)

        if (stored_token) {
            getMe(stored_token, expires_in)
            return
        }

        if (code) {
            createUser(code, expires_in)
            return
        }

        setShow(true)
    }

    async function createUser(code, expiry) {
        let [status, data,] = await agent.post("/user", {}, { code })
        if (status !== 200) {
            localStorage.removeItem("dailyjam:token")
            setShow(true)
            return
        }
        localStorage.setItem("dailyjam:token", JSON.stringify({ token: data.token, expiry }))
        localStorage.setItem("dailyjam:refresh_token", data.refresh_token)
        dispatch(register(data))
        props.setLocation("/")
        history.push("/")
    }

    async function getMe(token, expiry) {
        let [status, data,] = await agent.get("/user", {}, { token })
        if (status !== 200) {
            localStorage.removeItem("dailyjam:token")
            setShow(true)
            return
        }
        localStorage.setItem("dailyjam:token", JSON.stringify({ token: data.token, expiry }))
        localStorage.setItem("dailyjam:refresh_token", data.refresh_token)
        dispatch(register(data))
        history.goBack()
    }

    return show ? <div className="login">
        <img src={spotify} alt="Spotify logo" className="spotify-logo" />

        <div className="reasons">
            <ul>
                <li>Save your new found favourite albums</li>
                <li>Keep track of your progress</li>
                <li>Earn badges</li>
                <li>Count towards your Spotify wrapped</li>
            </ul>
        </div>

        <div onClick={() => {
            open_login()
        }} className="spotify-connect">
            <img className="symbol" src={symbol} alt="Spotify symbol" />
            <div className="text">Connect to Spotify</div>
        </div>

        <div className="or">
            <hr />
            <div className="text">OR</div>
        </div>


        <div className="guest" onClick={() => {
            localStorage.setItem("dailyjam:ignorelogin", true)
            props.setLocation("/")
            history.push("/")
        }}>Continue as guest</div>
    </div> : <Loading loading={!show} />
}