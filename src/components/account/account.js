import React from "react"
import { useDispatch } from "react-redux"
import history from "../../history"
import { register } from "../../store/reducers/user.slice"

export default function Account(props) {
    const dispatch = useDispatch()

    function logout() {
        localStorage.removeItem("dailyjam:token")
        sessionStorage.removeItem("dailyjam:user")

        dispatch(register(null))

        props.setLocation("/")
        history.push("/")
    }

    return <div>
        <button onClick={() => logout()}>LOGOUT</button>
    </div>
}