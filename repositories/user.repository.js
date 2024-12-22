const { where } = require("sequelize");
const { Op } = require("sequelize");

const User = require("../models/user");

const registerUser = async (userData) => {
  return await User.create(userData);
};

module.exports = {
    registerUser
};
