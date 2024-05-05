const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const sellers = require('./components/sellers/sellers-route');
const orders = require('./components/orders/orders-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  sellers(app);
  orders(app);

  return app;
};
