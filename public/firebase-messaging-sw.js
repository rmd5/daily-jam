// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBDv1hxkulbksWJXIDw9maBECSN_N3YgJ0",
    authDomain: "daily-jam-733de.firebaseapp.com",
    projectId: "daily-jam-733de",
    storageBucket: "daily-jam-733de.appspot.com",
    messagingSenderId: "150121528049",
    appId: "1:150121528049:web:e6e81c2c01ffae3a164750",
    measurementId: "G-QBYX5BHF3R"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    data = payload.notification

    const notificationTitle = data.title;
    const notificationOptions = {
        body: data.body,
        badge: data.image,
        icon: data.image,
        image: data.image
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});