const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Order, OrderItem, CartItem, ProductVariant, Product } = require('../database');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        include: [{
          model: ProductVariant,
          include: [{ model: Product }]
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, paymentDetails } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Shipping address and payment method required' });
    }

    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{
        model: ProductVariant,
        include: [{ model: Product }]
      }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.quantity * item.ProductVariant.Product.basePrice);
    }, 0);

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    const orderNumber = `ORD${year}${month}${day}${timestamp}`;

    const order = await Order.create({
      userId: req.user.id,
      orderNumber,
      totalAmount,
      shippingAddress,
      billingAddress: shippingAddress,
      paymentMethod,
      paymentStatus: 'paid'
    });

    const orderItems = cartItems.map(item => ({
      orderId: order.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      unitPrice: item.ProductVariant.Product.basePrice,
      totalPrice: item.quantity * item.ProductVariant.Product.basePrice
    }));

    await OrderItem.bulkCreate(orderItems);
    await CartItem.destroy({ where: { userId: req.user.id } });

    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [{
          model: ProductVariant,
          include: [{ model: Product }]
        }]
      }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{
        model: OrderItem,
        include: [{
          model: ProductVariant,
          include: [{ model: Product }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const whereClause = { id: req.params.id };
    
    if (req.user.role === 'customer') {
      if (status !== 'cancelled') {
        return res.status(403).json({ error: 'Customers can only cancel orders' });
      }
      whereClause.userId = req.user.id;
    }

    const order = await Order.findOne({ where: whereClause });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'cancelled' && !['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    await order.update({ status });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
