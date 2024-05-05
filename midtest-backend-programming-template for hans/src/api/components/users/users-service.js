const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Retrieve users with pagination, search, and sorting options
 * @param {number} page_number - Page number to retrieve
 * @param {number} page_size - Number of users per page
 * @param {string} search - Search query in the format 'field_name:search_key'
 * @param {string} sort - Sort query in the format 'field_name:sort_order'
 * @returns {Promise} - Promise resolving to an object containing paginated user data
 */
async function getUsers(page_number, page_size, search, sort) {

// inisialisasi variabel menggunakan let karena nilai akan berubah dan tidak constant
  let field_name = null;
  let search_key = null;
  let arrayForQuery = {};

//menggunakan split untuk memisahkan field name dan search key secara terpisah, 
//dan emnggunakan key insesitive untuk pencarian(search key)
  if (search){
  const search_Split = search.split(':');
    if (search_Split.length === 2){
      field_name = search_Split[0];
      search_key = search_Split[1];
      arrayForQuery = {
        [field_name]: {
        $regex: search_key,
        $options: 'i'
        }
      }
    }
  }

  //menginisialisasi field name untuk sort
  let sort_name = 'email';
  //menginisialisasi sort order dengan berawalan langsung dengan ascending
  let sort_order = 'asc';

  //memisahkan field name dan sort order menggunakan split lalu pengecekan jika yang diminta adalah desc maka
  //akan sort secara desc dan bila tidak diisi atau format salah maka akan sort secara ascending
  if(sort){
    const arraySort = sort.split(':');
    if(arraySort.length === 2 &&(arraySort[0] === 'email' || arraySort[0] === 'name')){
      sort_name = arraySort[0];
      sort_order = arraySort[1].toLowerCase();
      if(sort_order === 'desc'){
        sort_order = 'desc';
      }
      else{
        sort_order = 'asc';
      }
    }
  }

  const users = await usersRepository.getUsers(
    forPageSkip = (page_number * page_size) - page_size,
    page_size = parseInt(page_size),
    sort_name,
    sort_order,
    arrayForQuery
  );

  //hitung total user menggunakan forcount(total user yang ada di document)
  const total_users = await usersRepository.forCount(arrayForQuery)
  //Menghitung total halaman dengan menggunakan totaol user dibagi dengan pagesize
  const allPages = Math.ceil(total_users / page_size)
  
  
  //menggunakan arrow function untuk menentukan return get users yang keluar apa saja
  const output = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
  
  //membuat variabel bertipe boolean untuk kebutuhan output dari getusers
  const pageBefore = page_number > 1;
  const pageNext = page_number < allPages;
  return {
    page_number: parseInt(page_number),
    page_size: parseInt(page_size),
    count: users.length,
    total_pages: allPages,
    has_previous_page: pageBefore,
    has_next_page: pageNext,
    data: output,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

async function checkLoginCredentials(email, password) {
  const user = await usersRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      // token: generateToken(user.email, user.id),
    };
  }

  return null;
}

// using array untuk menyimpan jumlah percobaan sebagai ganti repository
let vault = {};
// set lama hukuman karena gagal percobaan sebanyak 5 kali
const maxPunishment = 15000;

/**
 * Update login attempts for a given email
 * @param {string} email - Email of the user
 * @returns {Promise} - Promise indicating the update of login attempts
 */
async function loginCheck(email) {
  const punishment = Date.now();

  if (vault[email]){
    const lastTime = vault[email].lastatt;
    if (punishment - lastTime > maxPunishment){
      vault[email].chances = 1;
    } 
    else{
      vault[email].chances++;
    }
    vault[email].lastatt = punishment;
  } 
  else{
    vault[email] = {
      chances: 1,
      lastatt: punishment
    };
  }
}

/**
 * Delete expired login punishment records
 * @returns {Promise} - Promise indicating the deletion of expired punishment records
 */
async function deletePunishment(){
  try{
    const punishment = Date.now();
    for(const email in vault){
      if(punishment - vault[email].lastatt >= maxPunishment){
        delete vault[email];
      }
    }
  }catch(error){
    return next (error)
  }
}

/**
 * Retrieve the number of login attempts for a given email
 * @param {string} email - Email of the user
 * @returns {Promise} - Promise resolving to the number of login attempts
 */
// fungsi untuk mendapatkan attempt
async function getAttempts(email) {
  if (vault[email]){
    return vault[email].chances;
  } 
  else{
    return 0;
  }
}

/**
 * Reset login attempts for a given email
 * @param {string} email - Email of the user
 */
// fungsi untuk menghapus attempt agar array kembali menjadi kosong
async function resetAttempts(email){
  delete vault[email];
}

//setinterval waktu habis lama hukuman
setInterval(deletePunishment,maxPunishment);

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  checkLoginCredentials,
  loginCheck,
  getAttempts,
  resetAttempts,
  deletePunishment,
};
