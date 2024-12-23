const userRepository = require('../repositories/user.repository')
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');

exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer")) {
        return next(new ApiError(401, 'Please Provide The Token'));
    }
    try {
        const user = await userRepository.findUserByToken(token)
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError(401, 'Invalid token'));
    }
});