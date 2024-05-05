const sellersService = require('./sellers-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getSellers(request, response, next) {
  try {
    const sellers = await sellersService.getSellers();
    return response.status(200).json(sellers);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getSeller(request, response, next) {
  try {
    const seller = await sellersService.getSeller(request.params.id);

    if (!seller) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(seller);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createSeller(request, response, next) {
  try {
    const ProductName = request.body.ProductName;
    const Price = request.body.Price;
    const Stock = request.body.Stock;
    const ProductDescription = request.body.ProductDescription;

    const nameIsRegistered = await sellersService.nameIsRegistered(ProductName);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Product is already registered'
      );
    }

    const success = await sellersService.createSeller(ProductName, Price, Stock, ProductDescription);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create seller'
      );
    }

    return response.status(200).json({ProductName, Price, Stock});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateSeller(request, response, next) {
  try {
    const id = request.params.id;
    const Stock = request.body.Stock;
    const ProductDescription = request.body.ProductDescription;

    const success = await sellersService.updateSeller(id, Stock, ProductDescription);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update seller'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteSeller(request, response, next) {
  try {
    const id = request.params.id;

    const success = await sellersService.deleteSeller(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete seller'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePrice(request, response, next) {
  const ProductName = request.body.ProductName;
  try {
    // Check password confirmation
    if (request.body.PriceNew !== request.body.PriceConfirm) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS, 'Wrong Price Confirmation'
      );
    }

    const changeSuccess = await sellersService.changePrice(
      request.params.id,
      request.body.PriceNew
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change price'
      );
    }

    return response.status(200).json({ProductName});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
  changePrice,
}