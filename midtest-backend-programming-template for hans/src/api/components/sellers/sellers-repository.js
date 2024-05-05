const { Seller } = require('../../../models');


/**
 * Get all sellers
 * @returns {Promise}
 */
async function getSellers() {
  return Seller.find({});
}

/**
 * Get seller detail by ID
 * @param {string} id - Seller ID
 * @returns {Promise}
 */
async function getSeller(id) {
  return Seller.findById(id);
}

/**
 * Create a new seller
 * @param {string} ProductName - Name of the product
 * @param {number} Price - Price of the product
 * @param {number} Stock - Stock quantity of the product
 * @param {string} ProductDescription - Description of the product
 * @returns {Promise}
 */
async function createSeller(ProductName,Price,Stock,ProductDescription) {
  return Seller.create({
    ProductName,
    Price,
    Stock,
    ProductDescription,
  });
}

/**
 * Update seller details
 * @param {string} id - Seller ID
 * @param {number} Stock - Updated stock quantity
 * @param {string} ProductDescription - Updated product description
 * @returns {Promise}
 */
async function updateSeller(id, Stock, ProductDescription) {
  return Seller.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        Stock,
        ProductDescription,
      },
    }
  );
}

/**
 * Delete a seller
 * @param {string} id - Seller ID
 * @returns {Promise}
 */
async function deleteSeller(id) {
  return Seller.deleteOne({ _id: id });
}

/**
 * Get seller by product name
 * @param {string} ProductName - Name of the product
 * @returns {Promise}
 */
async function getSellerByName(ProductName) {
  return Seller.findOne({ ProductName });
}

/**
 * Change the price of a product
 * @param {string} id - Seller ID
 * @param {number} Price - New price of the product
 * @returns {Promise}
 */
async function changePrice(id, Price) {
  return Seller.updateOne({ _id: id }, { $set: { Price } });
}

module.exports = {
 getSellers, 
 getSeller,
 createSeller,
 updateSeller,
 deleteSeller,
 changePrice,
 getSellerByName,
}