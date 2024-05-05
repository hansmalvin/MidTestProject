const { Order } = require('../../../models');

/**
 * Get orders
 * @returns {Promise}
 */

//agar bisa melihat seberapa banyak 1 akun mengorder item
async function getOrders() {
  return Order.find({});
}

/**
 * Get order detail by ID
 * @param {string} id - Order ID
 * @returns {Promise}
 */

async function getOrder(id) {
  return Order.findById(id);
}

/**
 * Create a new order
 * @param {string} BuyerName - Name of the buyer
 * @param {string} email - Email of the buyer
 * @param {string} password - Password of the buyer
 * @param {string} ItemsName - Name of the items ordered
 * @param {string} OrderQuantity - Quantity of the items ordered
 * @param {string} TotalPrice - Total price of the order
 * @param {string} Address - Address for shipping
 * @param {string} PaymentMethod - Payment method used
 * @returns {Promise}
 */
async function createOrder(BuyerName,email,password,ItemsName,
  OrderQuantity,TotalPrice,Address,PaymentMethod){
  return Order.create({
    BuyerName,
    email,
    password,
    ItemsName,
    OrderQuantity,
    TotalPrice,
    Address,
    PaymentMethod
  });
}

/**
 * Update an order
 * @param {string} id - Order ID
 * @param {string} ItemsName - Updated name of the items ordered
 * @param {string} OrderQuantity - Updated quantity of the items ordered
 * @param {string} TotalPrice - Updated total price of the order
 * @param {string} Address - Updated address for shipping
 * @returns {Promise}
 */
async function updateOrder(id, ItemsName,OrderQuantity,TotalPrice,Address) {
  return Order.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        ItemsName,
        OrderQuantity,
        TotalPrice,
        Address,
      },
    }
  );
}

/**
 * Delete an order
 * @param {string} id - Order ID
 * @returns {Promise}
 */
async function deleteOrder(id) {
  return Order.deleteOne({ _id: id });
}

/**
 * Get order detail by email
 * @param {string} email - Email of the buyer
 * @returns {Promise}
 */
async function getOrderByEmail(email) {
  return Order.findOne({ email });
}

/**
 * Change password of the buyer
 * @param {string} id - Order ID
 * @param {string} password - New password of the buyer
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return Order.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByEmail,
  changePassword,
}