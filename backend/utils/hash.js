const bcrypt = require("bcrypt");

/**
 * Hash user password
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Debug check (remove in production)
    console.log("Generated Hash:", hash);
    console.log("Hash Length:", hash.length);

    return hash;
  } catch (error) {
    console.error("Hash Password Error:", error);
    throw error;
  }
};

/**
 * Compare plain password with hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      console.log("Missing password or hash");
      return false;
    }

    // bcrypt hashes must be 60 chars
    if (hashedPassword.length !== 60) {
      console.log("Invalid hash length:", hashedPassword.length);
      return false;
    }

    const match = await bcrypt.compare(password, hashedPassword);

    console.log("Password Match:", match);

    return match;
  } catch (error) {
    console.error("Compare Password Error:", error);
    return false;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
