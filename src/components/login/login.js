import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import agent from "../../constants/agent"
import history from "../../history"
import { register } from "../../store/reducers/user.slice"
import Loading from "../loading/loading"

export default function Login() {
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

        if(stored_token !== token && token) {
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
        let [status, data, ] = await agent.post("/user", {}, { token })
        if (status !== 200) {
            localStorage.removeItem("dailyjam:token")
            setShow(true)
            return
        }
        dispatch(register(data))
        history.goBack()
    }

    async function getMe(token) {
        let [status, data, ] = await agent.get("/user", {}, { token })
        if (status !== 200) {
            localStorage.removeItem("dailyjam:token")
            setShow(true)
            return
        }
        dispatch(register(data))
        history.goBack()
    }

    return show ? <div>
        <a href={`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`}>Login to Spotify</a>
    </div> : <Loading loading={!show} />
}