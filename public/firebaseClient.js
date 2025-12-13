// Client-side Firebase initialization (browser only)
// Include in pages with: <script type="module" src="/firebaseClient.js"></script>
// Exports: app, auth, db. Add other SDKs as needed.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js'; // optional

const firebaseConfig = {
  apiKey: 'AIzaSyA7SDH3TFwIYfebsuIMUnYgFnYsTHh84Og',
  authDomain: 'next-circuit-df46d.firebaseapp.com',
  projectId: 'next-circuit-df46d',
  storageBucket: 'next-circuit-df46d.firebasestorage.app',
  messagingSenderId: '1071777518628',
  appId: '1:1071777518628:web:cd90e7ad581ccb2901f4b1'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // enable if needed and in browser environment

export { app, auth, db };
