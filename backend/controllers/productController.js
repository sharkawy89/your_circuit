const { getDb } = require('../lib/firebase');

const COLLECTION = 'products';

exports.getAllProducts = async (req, res) => {
	try {
		const { category, minPrice, maxPrice, search } = req.query;
		const db = getDb();
		let query = db.collection(COLLECTION);

		// Firestore requires indexed compound queries; keep filters simple
		if (category) {
			query = query.where('category', '==', category);
		}

		const snap = await query.get();
		let products = snap.docs.map(d => ({ id: d.id, ...d.data() }));

		// client-side filter for price/search to avoid index needs
		if (minPrice || maxPrice) {
			const min = minPrice ? parseFloat(minPrice) : Number.MIN_VALUE;
			const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_VALUE;
			products = products.filter(p => p.price >= min && p.price <= max);
		}
		if (search) {
			const s = search.toLowerCase();
			products = products.filter(p =>
				(p.name || '').toLowerCase().includes(s) ||
				(p.brand || '').toLowerCase().includes(s) ||
				(p.description || '').toLowerCase().includes(s)
			);
		}

		return res.status(200).json(products);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getProductById = async (req, res) => {
	try {
		const db = getDb();
		const doc = await db.collection(COLLECTION).doc(req.params.id).get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Product not found' });
		}
		return res.status(200).json({ id: doc.id, ...doc.data() });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.createProduct = async (req, res) => {
	try {
		const db = getDb();
		const ref = await db.collection(COLLECTION).add({
			...req.body,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});
		const doc = await ref.get();
		return res.status(201).json({ message: 'Product created successfully', product: { id: ref.id, ...doc.data() } });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const db = getDb();
		const ref = db.collection(COLLECTION).doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Product not found' });
		}
		await ref.update({ ...req.body, updatedAt: new Date().toISOString() });
		const updated = await ref.get();
		return res.status(200).json({ message: 'Product updated successfully', product: { id: ref.id, ...updated.data() } });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const db = getDb();
		const ref = db.collection(COLLECTION).doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Product not found' });
		}
		await ref.delete();
		return res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
