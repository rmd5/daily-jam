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

function App() {
	const theme = useSelector((state) => state.theme.value)
	const user = useSelector(state => state.user.value)
	const dispatch = useDispatch()
	const loading = useSelector(state => state.loading.value)
	const [location, setLocation] = useState(history.location.pathname)

	// function changeTheme() {
	// 	switch (theme) {
	// 		case "light":
	// 			dispatch(change("dark"))
	// 			break
	// 		case "dark":
	// 			dispatch(change("light"))
	// 			break
	// 		default:
	// 			console.log("something went wrong with themes")
	// 			break
	// 	}
	// }

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
				setTimeout(() => {
					dispatch(set_loading(false))
				}, 1000)
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
		setTimeout(() => {
			dispatch(set_loading(false))
		}, 1000)
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

					{/* Rendering outside of route to prevent rerender on page change */}
					<div hidden={location !== "/"}>
						<Home />
					</div>

					<Switch>
						<Route exact path="/login"><Login setLocation={setLocation} /></Route>
						<Route exact path="/history"><History /></Route>
						<Route exact path="/account"><Account setLocation={setLocation} /></Route>
					</Switch>
				</Router>
			</div>

			<FooterNav setLocation={setLocation} location={location} />
		</div>
	);
}

export default App;
