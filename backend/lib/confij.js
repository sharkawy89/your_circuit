 const firebase = require('firebase/app');



const firebaseConfig = {
  apiKey: "AIzaSyA7SDH3TFwIYfebsuIMUnYgFnYsTHh84Og",
  authDomain: "next-circuit-df46d.firebaseapp.com",
  projectId: "next-circuit-df46d",
  storageBucket: "next-circuit-df46d.firebasestorage.app",
  messagingSenderId: "1071777518628",
  appId: "1:1071777518628:web:cd90e7ad581ccb2901f4b1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const cols = db.collections("health check");


module.exports = cols;
