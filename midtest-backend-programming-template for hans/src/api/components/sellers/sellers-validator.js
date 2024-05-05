const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createProduct: {
    body: {
      ProductName: joi.string().min(1).max(100).required().label('Product Name'),
      Price: joi.string().min(3).max(100).required().label('Price'),
      Stock: joi.string().min(1).max(10).required().label('Stock'),
      ProductDescription: joi.string().min(1).max(10000).required().label('Description'),
    },
  },

  updateProduct: {
    body: {
      Stock: joi.string().min(1).max(10).required().label('Stock'),
      ProductDescription: joi.string().min(1).max(10000).required().label('Description'),
    },
  },

  changePrice: {
    body: {
      ProductName: joi.string().min(1).max(100).required().label('Product Name'),
      PriceNew: joi.string().min(3).max(10).required().label('New Price'),
      PriceConfirm: joi.string().min(3).max(10).required().label('Product Price Confirmation'),
    },
  },
}