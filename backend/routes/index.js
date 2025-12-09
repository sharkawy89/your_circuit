// Central route mounting for the API
module.exports = (app) => {
  app.use('/api/auth', require('./auth'));
  app.use('/api/products', require('./products'));
  app.use('/api/cart', require('./cart'));
  app.use('/api/orders', require('./orders'));
  app.use('/api/users', require('./users'));
};
