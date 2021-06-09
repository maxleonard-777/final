const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {apiKey: "AIzaSyBxfAHgf-3xzlllIXwU-BnqdtcbuUHpn2Q",
authDomain: "kiei-451-4a4a6.firebaseapp.com",
projectId: "kiei-451-4a4a6",
storageBucket: "kiei-451-4a4a6.appspot.com",
messagingSenderId: "184245553330",
appId: "1:184245553330:web:299f2b57c61d5265d461ab"} // replace

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase