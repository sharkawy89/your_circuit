// Client-side Firebase initialization (browser only)
// Include in pages with: <script type="module" src="/firebaseClient.js"></script>
// Exports: app, auth, db. Add other SDKs as needed.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js'; // optional

const firebaseConfig = {
  apiKey: 'AIzaSyBb0Qx1mxcOxe9VlpaAXe-wq3kdue6ke-M',
  authDomain: 'next-circuit.firebaseapp.com',
  databaseURL: 'https://next-circuit-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'next-circuit',
  storageBucket: 'next-circuit.firebasestorage.app',
  messagingSenderId: '876963628446',
  appId: '1:876963628446:web:2a205f90addf65acef028f',
  measurementId: 'G-P1ZCP7MSF1'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // enable if needed and in browser environment

export { app, auth, db };
