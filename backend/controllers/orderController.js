const { getDb } = require('../lib/firebase');

const ORDERS = 'orders';
const CARTS = 'carts';

exports.createOrder = async (req, res) => {
	try {
		const { shippingAddress, paymentMethod } = req.body;
		const db = getDb();
		const cartRef = db.collection(CARTS).doc(req.userId);
		const cartDoc = await cartRef.get();
		if (!cartDoc.exists || !cartDoc.data().items || cartDoc.data().items.length === 0) {
			return res.status(400).json({ error: 'Cart is empty' });
		}
		const cart = cartDoc.data();
		const items = cart.items;
		const totalAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

		const orderRef = await db.collection(ORDERS).add({
			userId: req.userId,
			items,
			totalAmount,
			shippingAddress,
			paymentMethod,
			status: 'pending',
			paymentStatus: 'pending',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});

		await cartRef.set({ items: [], updatedAt: new Date().toISOString() }, { merge: true });

		const doc = await orderRef.get();
		return res.status(201).json({ message: 'Order created successfully', order: { id: orderRef.id, ...doc.data() } });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getUserOrders = async (req, res) => {
	try {
		const db = getDb();
		const snap = await db.collection(ORDERS).where('userId', '==', req.userId).get();
		const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		return res.status(200).json(orders);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.getOrderById = async (req, res) => {
	try {
		const db = getDb();
		const doc = await db.collection(ORDERS).doc(req.params.id).get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Order not found' });
		}
		const order = doc.data();
		if (order.userId !== req.userId) {
			return res.status(403).json({ error: 'Unauthorized' });
		}
		return res.status(200).json({ id: doc.id, ...order });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.updateOrderStatus = async (req, res) => {
	try {
		const { status, paymentStatus } = req.body;
		const db = getDb();
		const ref = db.collection(ORDERS).doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Order not found' });
		}
		await ref.update({ status, paymentStatus, updatedAt: new Date().toISOString() });
		const updated = await ref.get();
		return res.status(200).json({ message: 'Order updated successfully', order: { id: ref.id, ...updated.data() } });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

exports.cancelOrder = async (req, res) => {
	try {
		const db = getDb();
		const ref = db.collection(ORDERS).doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Order not found' });
		}
		const order = doc.data();
		if (order.userId !== req.userId) {
			return res.status(403).json({ error: 'Unauthorized' });
		}
		if (order.status !== 'pending') {
			return res.status(400).json({ error: 'Can only cancel pending orders' });
		}
		await ref.update({ status: 'cancelled', updatedAt: new Date().toISOString() });
		const updated = await ref.get();
		return res.status(200).json({ message: 'Order cancelled successfully', order: { id: ref.id, ...updated.data() } });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
