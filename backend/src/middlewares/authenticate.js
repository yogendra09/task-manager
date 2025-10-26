const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return next(new ErrorHandler("please login to access the resource", 401));
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.id = id;
    next();
  } catch (error) {
    return next(new ErrorHandler("please login to access the resource", 401));
  }
};
