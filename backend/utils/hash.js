const md5 = require("md5");

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  try {
    const hash = md5(password);

    console.log("Generated MD5 Hash:", hash);
    console.log("Hash Length:", hash.length);

    return hash;
  } catch (error) {
    console.error("Hash Password Error:", error);
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      console.log("Missing password or hash");
      return false;
    }

    const hashedInput = md5(password);

    const match = hashedInput === hashedPassword;

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
