import React from "react"

import "./header.sass"

import logo from "../../assets/logo-alt.png"
import { useSelector } from "react-redux"

export default function Header() {
    const user = useSelector(state => state.user.value)
    console.log(user)

    return <div className="header">
        <img className="logo" src={logo} alt="Daily Jam" />
        <span className="text">Daily Jam</span>
        <div className="user">
            <div className="name">{user?.display_name.split(" ")[0]}</div>
            <img className="icon" src={user?.images[0].url} />
        </div>
    </div>
}