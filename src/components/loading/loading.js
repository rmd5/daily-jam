import React from "react"

import jam from "../../assets/jam.png"
import vinyl from "../../assets/vinyl.png"
import arm from "../../assets/arm.png"

import "./loading.sass"

export default function Loading(props) {
    return props.loading ? <div className='loader'>
        <div className='spinner'>
            <img className="jam" src={jam} alt="jam" />
            <img className='vinyl' src={vinyl} alt="vinyl" />
            <img className='arm' src={arm} alt="arm" />
        </div>
    </div> : null
}