// index.js

const firebaseConfig = require("../config/firebase-config"); // Import your Firebase config
const { initializeApp } = require("firebase/app"); // Import Firebase core

// Initialize Firebase at entry point of our app:
// initializeApp has safety to only initialise the app once.
// As we are using Firebase 9.x and later:
const app = initializeApp(firebaseConfig);

module.exports = { app };