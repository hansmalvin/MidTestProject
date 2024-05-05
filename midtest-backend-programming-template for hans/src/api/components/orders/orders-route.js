const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ordersControllers = require('./orders-controller');
const ordersValidator = require('./orders-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/purchases', route);

  //get a list of orders
  route.get('/', authenticationMiddleware, ordersControllers.getOrders);

  //create a order
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(ordersValidator.createOrd),
    ordersControllers.createOrder
  );

  //get order by id
  route.get('/:id', authenticationMiddleware, ordersControllers.getOrder);

  //update order
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(ordersValidator.updateOrder),
    ordersControllers.updateOrder
  );

  //delete order
  route.delete('/:id', authenticationMiddleware, ordersControllers.deleteOrder);

  //change password for buyer
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(ordersValidator.changePassword),
    ordersControllers.changePassword
  );
};