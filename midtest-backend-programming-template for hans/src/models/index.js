const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const sellersSchema = require('./sellers-schema');
const usersSchema = require('./users-schema');
const ordersSchema = require('./orders-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Seller = mongoose.model('sellers', mongoose.Schema(sellersSchema));
const Order = mongoose.model('orders',mongoose.Schema(ordersSchema))

module.exports = {
  mongoose,
  User,
  Seller,
  Order,
};
