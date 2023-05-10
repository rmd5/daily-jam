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

    function login() {
        let key = "dailyjam:token"
        const hash = window.location.hash
        let stored_token = localStorage.getItem(key)
        let token = hash?.substring(1)?.split("&")?.find(elem => elem.startsWith("access_token"))?.split("=")[1]
        window.location.hash = ""
        console.log(stored_token)

        if (stored_token !== token && token) {
            localStorage.setItem(key, token)
            createUser(token)
            return
        }

        if (stored_token) {
            getMe(stored_token)
            return
        }

        if (token) {
            localStorage.setItem(key, token)
            createUser(token)
            return
        }

        setShow(true)
    }

    async function createUser(token) {
        let [status, data,] = await agent.post("/user", {}, { token })
        if (status !== 200) {
            localStorage.removeItem("dailyjam:token")
            setShow(true)
            return
        }
        dispatch(register(data))
        props.setLocation("/")
        history.push("/")
    }

    async function getMe(token) {
        let [status, data,] = await agent.get("/user", {}, { token })
        if (status !== 200) {
            localStorage.removeItem("dailyjam:token")
            setShow(true)
            return
        }
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
            window.location.href=`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`
        }} className="spotify-connect">
            <img className="symbol" src={symbol} alt="Spotify symbol"/>
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