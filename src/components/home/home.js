import React, { useEffect, useState } from "react"
import agent from "../../constants/agent"
import Loading from "../loading/loading"
import Embed from "../spotify/embed"

export default function Home(props) {
    const [album, setAlbum] = useState(null)
	const [loading, setLoading] = useState(true)

    useEffect(() => {
		getEmbed()
	}, [])

	async function getEmbed() {
		let key = "dailyjam:album"
		let cachedAlbum = localStorage.getItem(key)
		if (cachedAlbum) {
			let jsonAlbum = JSON.parse(cachedAlbum)

			let albumDate = new Date(jsonAlbum?.date)

			let tomorrow = new Date()
			tomorrow.setDate(albumDate.getDate() + 1)
			tomorrow.setHours(9)
			tomorrow.setMinutes(0)
			tomorrow.setSeconds(0)

			if (albumDate < tomorrow) {
				setAlbum(jsonAlbum)
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
				return
			}
		}

		let [status, data, error] = await agent.get("/spotify/album", {})

		if (status != 200) {
			console.log(error)
			return
		}

		localStorage.setItem(key, JSON.stringify(data))
		setAlbum(data)
		setTimeout(() => {
			setLoading(false)
		}, 1000)
		return
	}

    return <div>
        <Loading loading={loading} />
        <Embed album={album} />
    </div>
}