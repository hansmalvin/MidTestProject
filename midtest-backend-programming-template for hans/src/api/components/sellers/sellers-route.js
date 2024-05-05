const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const sellersControllers = require('./sellers-controller');
const sellersValidator = require('./sellers-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  //get all products
route.get('/', authenticationMiddleware, sellersControllers.getSellers);

  // Create product
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(sellersValidator.createProduct),
    sellersControllers.createSeller
  );

  //get product by id
  route.get('/:id', authenticationMiddleware, sellersControllers.getSeller);
  
  //update product
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(sellersValidator.updateProduct),
    sellersControllers.updateSeller
  );

  //delete product
  route.delete('/:id', authenticationMiddleware, sellersControllers.deleteSeller);

  //change price
  route.post(
    '/:id/change-price',
    authenticationMiddleware,
    celebrate(sellersValidator.changePrice),
    sellersControllers.changePrice
  );
}