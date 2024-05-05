const ordersService = require('./orders-service');
const { errorResponder, errorTypes } = require('../../../core/errors');


/**
 * Handle get orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrders(request, response, next) {
  try {
    const orders = await ordersService.getOrders();
    return response.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrder(request, response, next) {
  try {
    const order = await ordersService.getOrder(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 
        'Unknown user');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createOrder(request, response, next) {
  try {
    const BuyerName = request.body.BuyerName;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
    const ItemsName = request.body.ItemsName;
    const OrderQuantity = request.body.OrderQuantity;
    const TotalPrice = request.body.TotalPrice;
    const Address = request.body.Address;
    const PaymentMethod = request.body.PaymentMethod;

    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    const success = await ordersService.createOrder(BuyerName,email,
      password,ItemsName,
      OrderQuantity,TotalPrice,Address,PaymentMethod);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create order'
      );
    }
    return response.status(200).json({ BuyerName, email, ItemsName, 
      OrderQuantity, TotalPrice, PaymentMethod });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateOrder(request, response, next) {
  try {
    const id = request.params.id;
    const ItemsName = request.body.ItemsName;
    const OrderQuantity = request.body.OrderQuantity;
    const TotalPrice = request.body.TotalPrice;
    const Address = request.body.Address;

    const success = await ordersService.updateOrder(id, ItemsName,
      OrderQuantity,TotalPrice,Address);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update order'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteOrder(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ordersService.deleteOrder(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete order'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {

    if (request.body.passwordNew !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    if (
      !(await ordersService.checkPassword(
        request.params.id,
        request.body.passwordOld
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await ordersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  changePassword,
}