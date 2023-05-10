import { HistoryOutlined, HomeOutlined, SettingOutlined, StarOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import history from "../../history"

import "./footer.sass"

export default function FooterNav(props) {
    const user = useSelector(state => state.user.value)
    const [active, setActive] = useState(props.location)

    useEffect(() => {
        if (props.location !== active) {
            setActive(props.location)
        }
    }, [props.location]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.location !== active) {
            props.setLocation(active)
        }
    }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

    return <div className="footer">
        <Item active={active} setActive={setActive} name="Home" href="/" icon={<HomeOutlined />} />
        <Item active={active} setActive={setActive} name="History" href="/history" icon={<HistoryOutlined />} />
        {user ? <Item active={active} setActive={setActive} name="Starred" href="/starred" icon={<StarOutlined />} /> : null}
        <Item active={active} setActive={setActive} name="Settings" href="/settings" icon={<SettingOutlined />} />
    </div>
}

function Item(props) {
    return <div onClick={() => {
        props.setActive(props.href)
        history.push(props.href)
    }} className={`item ${props.active === props.href ? "active" : ""}`}>{props.icon}</div>
}