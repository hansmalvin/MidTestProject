const ordersRepository = require('./orders-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getOrders() {
  const orders = await ordersRepository.getOrders();

  const results = [];
  for (let i = 0; i < orders.length; i += 1) {
    const order = orders[i];
    results.push({
      id: order.id,
      BuyerName: order.BuyerName,
      email: order.email,
      ItemsName: order.ItemsName,
      OrderQuantity: order.OrderQuantity,
      TotalPrice: order.TotalPrice,
      Address: order.Address,
      PaymentMethod: order.PaymentMethod,
    });
  }
  return results;
}

/**
 * Get user detail
 * @param {string} id - Order ID
 * @returns {Object}
 */
async function getOrder(id) {
  const order = await ordersRepository.getOrder(id);

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    BuyerName: order.name,
    email: order.email,
    ItemsName: order.ItemsName,
    OrderQuantity: order.OrderQuantity,
    TotalPrice: order.TotalPrice,
    Address: order.Address,
    PaymentMethod: order.PaymentMethod,

  };
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
 * @returns {Promise<boolean|null>} True if order creation is successful, null if failed
 */
async function createOrder(BuyerName,email,password,ItemsName,
  OrderQuantity,TotalPrice,Address,PaymentMethod) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await ordersRepository.createOrder(BuyerName,email, hashedPassword,ItemsName,
      OrderQuantity,TotalPrice,Address,PaymentMethod);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update an existing order
 * @param {string} id - Order ID
 * @param {string} ItemsName - Updated name of the items ordered
 * @param {string} OrderQuantity - Updated quantity of the items ordered
 * @param {string} TotalPrice - Updated total price of the order
 * @param {string} Address - Updated address for shipping
 * @returns {Promise<boolean|null>} True if order update is successful, null if failed
 */
async function updateOrder(id, ItemsName,OrderQuantity,
  TotalPrice,Address) {
  const order = await ordersRepository.getOrder(id);

  if (!order) {
    return null;
  }

  try {
    await ordersRepository.updateOrder(id, ItemsName,
      OrderQuantity,TotalPrice,Address);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete an existing order
 * @param {string} id - Order ID
 * @returns {Promise<boolean|null>} True if order deletion is successful, null if failed
 */
async function deleteOrder(id) {
  const order = await ordersRepository.getOrder(id);

  if (!order) {
    return null;
  }

  try {
    await ordersRepository.deleteOrder(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email is already registered, false otherwise
 */
async function emailIsRegistered(email) {
  const order = await ordersRepository.getOrderByEmail(email);

  if (order) {
    return true;
  }

  return false;
}

/**
 * Check if password matches the one stored for the user
 * @param {string} userId - Order ID
 * @param {string} password - Password to check
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
async function checkPassword(userId, password) {
  const order = await ordersRepository.getOrder(userId);
  return passwordMatched(password, order.password);
}

/**
 * Change password for the user
 * @param {string} userId - Order ID
 * @param {string} password - New password
 * @returns {Promise<boolean|null>} True if password change is successful, null if failed
 */
async function changePassword(userId, password) {
  const order = await ordersRepository.getOrder(userId);

  if (!order) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await ordersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  emailIsRegistered,
  checkPassword,
  changePassword,
}