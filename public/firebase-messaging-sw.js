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
    data = payload.data
    console.log(data)

    const notificationTitle = data.title;
    const notificationOptions = {
        body: data.body,
        badge: data.icon,
        icon: data.icon,
        data: {
            url: "https://daily-jam.pages.dev/",
        }
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll().then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});