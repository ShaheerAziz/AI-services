const { where } = require("sequelize");
const { Op } = require("sequelize");

const User = require("../models/user");

const registerUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
    return await User.findOne({where: {email: email}})
}

const findUserByToken = async (token) => {
    return await User.findOne({where: {tokens: {[Op.includes]: token}}})
}

module.exports = {
    registerUser,
    findUserByEmail,
    findUserByToken
};
