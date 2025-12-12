const { getDb } = require('../lib/firebase');

const USERS = 'users';

exports.getUserProfile = async (req, res) => {
	try {
		const db = getDb();
		const doc = await db.collection(USERS).doc(req.userId).get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'User not found' });
		}
		const user = doc.data();
		return res.status(200).json({ id: doc.id, name: user.name, email: user.email, phone: user.phone, address: user.address });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.updateUserProfile = async (req, res) => {
	try {
		const { name, phone, address } = req.body;
		const db = getDb();
		const ref = db.collection(USERS).doc(req.userId);
		const doc = await ref.get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'User not found' });
		}
		await ref.update({ name, phone, address, updatedAt: new Date().toISOString() });
		const updated = await ref.get();
		const user = updated.data();
		return res.status(200).json({ message: 'Profile updated successfully', user: { id: ref.id, name: user.name, email: user.email, phone: user.phone, address: user.address } });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const db = getDb();
		const snap = await db.collection(USERS).get();
		const users = snap.docs.map(d => {
			const u = d.data();
			return { id: d.id, name: u.name, email: u.email, phone: u.phone, address: u.address };
		});
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
