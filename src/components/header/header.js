import React from "react"

import "./header.sass"

import logo from "../../assets/logo-alt.png"
import { useSelector } from "react-redux"
import history from "../../history"
import { UserOutlined } from "@ant-design/icons"

export default function Header(props) {
    const user = useSelector(state => state.user.value)

    function user_icon(location) {
        props.setLocation(location)
        history.push(location)
    }

    return <div className="header">
        <img className="logo" src={logo} alt="Daily Jam" />
        <span className="text">Daily Jam</span>
        <div className="user" onClick={() => user_icon(user ? "/account" : "/login")}>
            <div className="name">{user?.display_name.split(" ")[0] || "Login"}</div>
            {user ? <img alt="User Icon" className="icon" src={user?.images[0].url} /> : <UserOutlined className="icon login" />}
        </div>
    </div>
}