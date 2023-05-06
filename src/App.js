import "./firebase"
import Loading from './components/loading/loading';
import { useState } from "react";
import { fetchToken, onMessageListener } from "./firebase";

function App() {
	fetchToken(() => {});

	const [show, setShow] = useState(false);
	const [notification, setNotification] = useState({ title: '', body: '', image: '' });

	onMessageListener().then(payload => {
		setShow(true);
		setNotification({ title: payload.notification.title, body: payload.notification.body, image: payload.notification.image })
		console.log(payload);
	}).catch(err => console.log('failed: ', err));

	return (
		<div className="App">
			<Loading loading={true} />
		</div>
	);
}

export default App;
