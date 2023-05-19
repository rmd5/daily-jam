import { HistoryOutlined, HomeOutlined, SettingOutlined, StarOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import history from "../../history"

import "./footer.sass"

export default function FooterNav(props) {
    const user = useSelector(state => state.user.value)
    const [active, setActive] = useState(props.location)
    const pages = [
        {
            name: "Home",
            href: "/",
            icon: <HomeOutlined />,
            user: false
        },
        {
            name: "History",
            href: "/history",
            icon: <HistoryOutlined />,
            user: false
        },
        {
            name: "Starred",
            href: "/starred",
            icon: <StarOutlined />,
            user: true
        },
        {
            name: "Settings",
            href: "/settings",
            icon: <SettingOutlined />,
            user: true
        }
    ]
    const [section, setSection] = useState(props.location ? pages.findIndex(e => e.href === props.location) : null)

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
        <div className="back-mover" style={{
            left: section * (100 / (user ? pages.length : pages.filter(e => !e.user).length)) + "%",
            width: (100 / (user ? pages.length : pages.filter(e => !e.user).length)) + "%",
            display: pages.filter(e => e.href === active).length === 0 ? "none" : ""
        }}></div>
        {pages.map((e, n) => {
            if (e.user) {
                return user ? <Item key={n} setSection={setSection} section={n} active={active} setActive={setActive} name={e.name} href={e.href} icon={e.icon} /> : null
            } else {
                return <Item key={n} setSection={setSection} section={n} active={active} setActive={setActive} name={e.name} href={e.href} icon={e.icon} />
            }
        })}
    </div>
}

function Item(props) {
    return <div onClick={() => {
        props.setSection(props.section)
        props.setActive(props.href)
        history.push(props.href)
    }} className={`item ${props.active === props.href ? "active" : ""}`}>{props.icon}</div>
}