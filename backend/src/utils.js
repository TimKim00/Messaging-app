const bcrypt = require("bcryptjs");

/**
 * Filters out private information from a user object.
 * @param {Object} user - The user object containing private information.
 * @returns {Object} - The filtered user object without private information.
 */
function filterPrivateInfo(user) {
    // Define the list of private fields to be removed
    const privateFields = ['h_password', 'email'];

    // Create a new object to store the filtered user data
    let filteredUser = {};

    // Iterate over the user object and copy only the non-private fields to the new object
    for (let key in user) {
        if (!privateFields.includes(key)) {
            filteredUser[key] = user[key];
        }
    }

    return filteredUser;
}

/**
 * Creates a new hashed password.
 * @param {String} password - The password string.
 * @returns {String} - The hashed password.
 */
function hashPassword(password) {
    return bcrypt.hashSync(password);
}

module.exports = {
    filterPrivateInfo,
    hashPassword,
};