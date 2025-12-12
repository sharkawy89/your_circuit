const admin = require('firebase-admin');

let app;

function initFirebase() {
  if (app) return app;
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!encoded) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');
  }
  let creds;
  try {
    const json = Buffer.from(encoded, 'base64').toString('utf8');
    creds = JSON.parse(json);
  } catch (err) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT (base64-encoded JSON)');
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
