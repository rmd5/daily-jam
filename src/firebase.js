// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import agent from "./constants/agent";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBDv1hxkulbksWJXIDw9maBECSN_N3YgJ0",
	authDomain: "daily-jam-733de.firebaseapp.com",
	projectId: "daily-jam-733de",
	storageBucket: "daily-jam-733de.appspot.com",
	messagingSenderId: "150121528049",
	appId: "1:150121528049:web:e6e81c2c01ffae3a164750",
	measurementId: "G-QBYX5BHF3R"
};

export const fetchToken = (setTokenFound) => {
	return getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY }).then(async (currentToken) => {
		if (currentToken) {
			console.log('current token for client: ', currentToken);
			let [status, data, error] = await agent.post("/notifications/subscribe", { token: currentToken })
			if (error) {
				console.log(error)
			} else {
				console.log(data)
			}
			setTokenFound(true);
			// Track the token -> client mapping, by sending to backend server
			// show on the UI that permission is secured
		} else {
			console.log('No registration token available. Request permission to generate one.');
			setTokenFound(false);
			// shows on the UI that permission is required 
		}
	}).catch((err) => {
		console.log('An error occurred while retrieving token. ', err);
		// catch error while creating client token
	});
}

export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);