import React from "react"
import { useSelector } from "react-redux"

import jam from "../../assets/jam-alt.png"
import vinyl from "../../assets/vinyl-alt.png"
import arm from "../../assets/arm-alt.png"

import "./loading.sass"

export default function Loading(props) {
    const theme = useSelector((state) => state.theme.value)

    return props.loading ? <div className={`loader ${theme}`}>
        <div className='spinner'>
            <img className="jam" src={jam} alt="jam" />
            <img className='vinyl' src={vinyl} alt="vinyl" />
            <img className='arm' src={arm} alt="arm" />
        </div>
    </div> : null
}