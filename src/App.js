import "./firebase"
import { fetchToken } from "./firebase";

import history from "./history";
import { Router, Switch, Route } from "react-router";
import Home from "./components/home/home";
import { useDispatch, useSelector } from "react-redux";
import FooterNav from "./components/navigation/footer";
import { set } from "./store/reducers/albums.slice";
import Loading from "./components/loading/loading";
import { useEffect, useState } from "react";
import agent from "./constants/agent";
import History from "./components/history/history";
import { set_loading } from "./store/reducers/loading.slice";
import Header from "./components/header/header";
import Login from "./components/login/login";
import Account from "./components/account/account";
import Starred from "./components/starred/starred";
import AlbumById from "./components/album_by_id/album_by_id";
import { store_device } from "./store/reducers/player.slice";

import superagent from "superagent"

function App() {
	const theme = useSelector((state) => state.theme.value)
	const user = useSelector(state => state.user.value)
	const album = useSelector(state => state.albums.recent)
	const dispatch = useDispatch()
	const loading = useSelector(state => state.loading.value)
	const [location, setLocation] = useState(history.location.pathname)

	const [duration, setDuration] = useState(0)
	const [position, setPosition] = useState(0)
	const [paused, setPaused] = useState(true)
	const [context, setContext] = useState(null)

	async function check_token() {
		let key = "dailyjam:token"

		let stored_token_obj = JSON.parse(localStorage.getItem(key))
		let expiry = stored_token_obj?.expiry

		let today = new Date()
		if (new Date(expiry) < today) {
			setLocation("/login")
			history.push("/login")
		}

		let token = stored_token_obj?.token
		if (token) {
			let [status,,] = await agent.get("/user", {}, { token })
			const scope = "streaming app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private"
			if (status !== 200) {
				localStorage.removeItem("dailyjam:token")
				window.location.href = `${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${scope}`
			}
		}
	}

	useEffect(() => {
		if (user?.token && album?.raw?.uri) {
			check_token()

			const script = document.createElement("script");
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;

			document.body.appendChild(script);

			window.onSpotifyWebPlaybackSDKReady = () => {
				const token = user?.token
				const player = new window.Spotify.Player({
					name: 'Daily Jam',
					getOAuthToken: cb => { cb(token); }
				});

				// Ready
				player.addListener('ready', async ({ device_id }) => {
					dispatch(store_device(device_id))
					superagent.put("https://api.spotify.com/v1/me/player")
						.set({ "Authorization": `Bearer ${user?.token}` }).send({
							device_ids: [device_id]
						}).then(() => {
							dispatch(set_loading(false))
						}).catch(err => {
							console.log(err)
						})
				});

				// Not Ready
				player.addListener('not_ready', ({ device_id }) => {
					console.log('Device ID has gone offline', device_id);
				});

				player.addListener('player_state_changed', (res) => {
					if (res) {
						let { duration, position, paused, context } = res
						setPaused(paused)
						setPosition(position)
						setDuration(duration)
						if (context?.uri !== "") {
							setContext(context)
						}
						player.activateElement()
					}
				});

				player.on('authentication_error', async ({ message }) => {
					console.log(message)
					// let token = user?.refresh_token || localStorage.getItem("dailyjam:refresh_token")
					// let [res, data,] = await agent.get("/spotify/auth/refresh", {}, { refresh_token: token })
					// if (res === 200) {
					// 	dispatch(register(data))

					// 	let expires_in = new Date()
					// 	expires_in.setSeconds(expires_in.getSeconds() + 3600)
					// 	localStorage.setItem("dailyjam:token", JSON.stringify({
					// 		token: data.token,
					// 		expiry: expires_in
					// 	}))
					// }
				});

				player.connect();
			}
		}
	}, [user, album]) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!user && !localStorage.getItem("dailyjam:ignorelogin")) {
			setLocation("/login")
			history.push("/login")
		}
		getEmbed()
		fetchToken(() => { });
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	async function getEmbed() {
		let key = "dailyjam:albums"
		let cachedAlbums = localStorage.getItem(key)
		if (cachedAlbums) {
			let jsonAlbums = JSON.parse(cachedAlbums)

			let albumDate = new Date(jsonAlbums?.[0]?.date)

			let tomorrow = new Date()
			tomorrow.setDate(albumDate.getDate() + 1)
			tomorrow.setHours(9)
			tomorrow.setMinutes(0)
			tomorrow.setSeconds(0)

			if (tomorrow > new Date()) {
				dispatch(set(jsonAlbums))
				return
			}
		}

		let [status, data, error] = await agent.get("/spotify/album/all", {}, {})

		if (status !== 200) {
			console.log(error)
			return
		}

		localStorage.setItem(key, JSON.stringify(data))
		dispatch(set(data))
		return
	}

	// const [show, setShow] = useState(false);
	// const [notification, setNotification] = useState({ title: '', body: '', image: '' });

	// onMessageListener().then(payload => {
	// 	setShow(true);
	// 	setNotification({ title: payload.notification.title, body: payload.notification.body, image: payload.notification.image })
	// 	console.log(payload);
	// }).catch(err => console.log('failed: ', err));

	return (
		<div className={theme}>
			<Loading loading={loading} />

			<Header setLocation={setLocation} location={location} />

			<div className="main">
				<Router history={history}>
					<Switch>
						<Route exact path="/"><Home full={true} album={album} duration={duration} position={position} paused={paused} context={context} /></Route>
						<Route exact path="/login"><Login setLocation={setLocation} /></Route>
						<Route exact path="/history"><History duration={duration} position={position} paused={paused} context={context} /></Route>
						{user ? <Route exact path="/starred"><Starred /></Route> : null}
						<Route exact path="/account"><Account setLocation={setLocation} /></Route>
						<Route exact path="/settings"></Route>
						<Route path="/:id" render={(props) => <AlbumById duration={duration} position={position} paused={paused} context={context} {...props} />}></Route>
					</Switch>
				</Router>
			</div>

			<FooterNav setLocation={setLocation} location={location} />
		</div>
	);
}

export default App;
