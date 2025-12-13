// Central route mounting for the API
module.exports = (app) => {
  // Mount with /api prefix (primary)
  app.use('/api/auth', require('./auth'));
  app.use('/api/products', require('./products'));
  app.use('/api/cart', require('./cart'));
  app.use('/api/orders', require('./orders'));
  app.use('/api/users', require('./users'));

  // Also mount without /api for environments where the platform strips the prefix
  app.use('/auth', require('./auth'));
  app.use('/products', require('./products'));
  app.use('/cart', require('./cart'));
  app.use('/orders', require('./orders'));
  app.use('/users', require('./users'));
};
