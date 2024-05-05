const sellersRepository = require('./sellers-repository');
const passwordMatched = require('../../../utils/password');

/**
 * Get all sellers
 * @returns {Promise}
 */
async function getSellers() {
  const sellers = await sellersRepository.getSellers();

  const results = [];
  for (let i = 0; i < sellers.length; i += 1) {
    const seller = sellers[i];
    results.push({
      id: seller.id,
      ProductName: seller.ProductName,
      Price: seller.Price,
      Stock: seller.Stock,
      ProductDescription: seller.ProductDescription,
    });
  }
  return results;
}

/**
 * Get seller detail by ID
 * @param {string} id - Seller ID
 * @returns {Promise}
 */
async function getSeller(id) {
  const seller = await sellersRepository.getSeller(id);

  if (!seller) {
    return null;
  }

  return {
    id: seller.id,
    ProductName: seller.ProductName,
    Price: seller.Price,
    Stock: seller.Stock,
    ProductDescription: seller.ProductDescription,
  };
}

/**
 * Create a new seller
 * @param {string} ProductName - Name of the product
 * @param {number} Price - Price of the product
 * @param {number} Stock - Stock quantity of the product
 * @param {string} ProductDescription - Description of the product
 * @returns {Promise}
 */
async function createSeller(ProductName, Price, Stock, ProductDescription) {
  try {
    await sellersRepository.createSeller(ProductName, Price, Stock, ProductDescription);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update seller details
 * @param {string} id - Seller ID
 * @param {number} Stock - Updated stock quantity
 * @param {string} ProductDescription - Updated product description
 * @returns {Promise}
 */
async function updateSeller(id, Stock, ProductDescription) {
  const seller = await sellersRepository.getSeller(id);

  if (!seller) {
    return null;
  }

  try {
    await sellersRepository.updateSeller(id, Stock, ProductDescription);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete a seller
 * @param {string} id - Seller ID
 * @returns {Promise}
 */
async function deleteSeller(id) {
  const seller = await sellersRepository.getSeller(id);

  if (!seller) {
    return null;
  }

  try {
    await sellersRepository.deleteSeller(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check if a product name is already registered
 * @param {string} ProductName - Name of the product
 * @returns {Promise}
 */
async function nameIsRegistered(ProductName) {
  const seller = await sellersRepository.getSellerByName(ProductName);

  if (seller) {
    return true;
  }

  return false;
}

/**
 * Change the price of a product
 * @param {string} userId - Seller ID
 * @param {number} Price - New price of the product
 * @returns {Promise}
 */
async function changePrice(userId, Price) {
  const seller = await sellersRepository.getSeller(userId);

  if (!seller) {
    return null;
  }
  const changeSuccess = await sellersRepository.changePrice(
    userId,
    Price,
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
  nameIsRegistered,
  changePrice,
}