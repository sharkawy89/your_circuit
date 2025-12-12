const { getDb } = require('../lib/firebase');

const CARTS = 'carts';
const PRODUCTS = 'products';

const getCartDoc = async (db, userId) => {
	const ref = db.collection(CARTS).doc(userId);
	const doc = await ref.get();
	if (!doc.exists) {
		return { ref, cart: { items: [], updatedAt: new Date().toISOString() } };
	}
	return { ref, cart: doc.data() };
};

exports.getCart = async (req, res) => {
	try {
		const db = getDb();
		const { cart } = await getCartDoc(db, req.userId);
		return res.status(200).json(cart);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const db = getDb();

		const productDoc = await db.collection(PRODUCTS).doc(productId).get();
		if (!productDoc.exists) {
			return res.status(404).json({ error: 'Product not found' });
		}
		const product = productDoc.data();

		const { ref, cart } = await getCartDoc(db, req.userId);
		const items = cart.items || [];
		const existing = items.find(i => i.productId === productId);
		if (existing) {
			existing.quantity += quantity;
		} else {
			items.push({ productId, quantity, price: product.price });
		}

		const updated = { items, updatedAt: new Date().toISOString() };
		await ref.set(updated, { merge: true });
		return res.status(200).json({ message: 'Item added to cart', cart: updated });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.removeFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const db = getDb();
		const { ref, cart } = await getCartDoc(db, req.userId);
		const items = (cart.items || []).filter(i => i.productId !== productId);
		const updated = { items, updatedAt: new Date().toISOString() };
		await ref.set(updated, { merge: true });
		return res.status(200).json({ message: 'Item removed from cart', cart: updated });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.updateCartItem = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const db = getDb();
		const { ref, cart } = await getCartDoc(db, req.userId);
		let items = cart.items || [];
		const item = items.find(i => i.productId === productId);
		if (!item) {
			return res.status(404).json({ error: 'Item not found in cart' });
		}
		if (quantity <= 0) {
			items = items.filter(i => i.productId !== productId);
		} else {
			item.quantity = quantity;
		}
		const updated = { items, updatedAt: new Date().toISOString() };
		await ref.set(updated, { merge: true });
		return res.status(200).json({ message: 'Cart updated', cart: updated });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.clearCart = async (req, res) => {
	try {
		const db = getDb();
		const ref = db.collection(CARTS).doc(req.userId);
		const updated = { items: [], updatedAt: new Date().toISOString() };
		await ref.set(updated, { merge: true });
		return res.status(200).json({ message: 'Cart cleared' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
