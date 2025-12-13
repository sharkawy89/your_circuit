require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { getDb } = require('../lib/firebase');

(async () => {
  try {
    const db = getDb();
    const cols = await db.listCollections();
    console.log('Firebase connection OK. Collections:', cols.map(c => c.id));
  } catch (e) {
    console.error('Firebase check failed:', e);
    process.exitCode = 1;
  }
})();
