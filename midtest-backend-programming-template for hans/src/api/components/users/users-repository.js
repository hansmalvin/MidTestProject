const { User } = require('../../../models');

/**
 * Retrieve users with pagination and sorting
 * @param {number} page_number - Page number for pagination
 * @param {number} page_size - Number of items per page
 * @param {string} sort_name - Name of the field to sort by
 * @param {number} sort_order - Sort order (1 for ascending, -1 for descending)
 * @param {Array} arrayForQuery - Array of query conditions
 * @returns {Promise} - Promise resolving to an array of users
 */
async function getUsers(page_number,page_size,
  sort_name,sort_order,arrayForQuery) {
  return User
  .find(arrayForQuery)
  .skip(page_number)
  .limit(page_size)
  .sort({
    [sort_name]: sort_order
  });
}

/**
 * Count the total number of users
 * @returns {Promise} - Promise resolving to the total count of users
 */
//untuk menghitung jumlah dari user digunakan untuk mendapatkan pages
async function forCount(){
  return User.countDocuments();
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  forCount,
};
