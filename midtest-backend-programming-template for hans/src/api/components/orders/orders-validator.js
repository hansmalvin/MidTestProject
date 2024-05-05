const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createOrd: {
    body: {
      BuyerName: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
      password_confirm: joi.string().required().label('Password confirmation'),
      ItemsName: joi.string().min(1).max(100).required().label('Items Name'),
      OrderQuantity: joi.string().min(1).max(100).required().label('Items Quantity'),
      TotalPrice: joi.string().min(1).max(100).required().label('Total Price'),
      Address: joi.string().min(1).max(1000).required().label('Address'),
      PaymentMethod: joi.string().min(1).max(45).required().label('Payment Method'),
    },
  },

  updateOrder: {
    body: {
      ItemsName: joi.string().min(1).max(100).required().label('Items Name'),
      OrderQuantity: joi.string().min(1).max(100).required().label('Items Quantity'),
      TotalPrice: joi.string().min(1).max(100).required().label('Total Price'),
      Address: joi.string().min(1).max(1000).required().label('Address'),
    },
  },

  changePassword: {
    body: {
      passwordOld: joi.string().required().label('Old password'),
      passwordNew: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('New password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },
}