import "./firebase"
import Loading from './components/loading/loading';
import { fetchToken } from "./firebase";

import history from "./history";
import { Router, Switch, Route } from "react-router";
import Home from "./components/home/home";

function App() {
	fetchToken(() => { });

	// const [show, setShow] = useState(false);
	// const [notification, setNotification] = useState({ title: '', body: '', image: '' });

	// onMessageListener().then(payload => {
	// 	setShow(true);
	// 	setNotification({ title: payload.notification.title, body: payload.notification.body, image: payload.notification.image })
	// 	console.log(payload);
	// }).catch(err => console.log('failed: ', err));

	return (
		<div className="App">
			<Router history={history}>
				<Switch>
					<Route exact path="/" component={Home} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
