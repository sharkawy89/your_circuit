const admin = require('firebase-admin');

let app;

function initFirebase() {
  if (app) return app;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');
  }
  let creds;
  try {
    creds = JSON.parse(raw);
  } catch (err) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT (expected raw JSON string)');
  }
  app = admin.initializeApp({
    credential: admin.credential.cert(creds),
  });
  return app;
}

function getDb() {
  initFirebase();
  return admin.firestore();
}

module.exports = {
  getDb,
  admin,
};
