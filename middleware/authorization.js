import Accounts from "../models/accountsModel.js";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import Employee from "../models/employeeModel.js";
import Owner from "../models/ownersModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const APIusers = { Accounts, Employee, Owner };

const AdminAuthorization = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer"))
    throw new AppError("Missing authorization header", 403, 200);

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, envConfig.JWT.secret);

  if (decoded.title !== "Owner" && decoded.title !== "Employee")
    throw new AppError("user not authorized", 403, 201);

  const title = decoded.title;
  const user = await APIusers[title].findById(decoded._id).populate("role");

  if (!user)
    throw new AppError("user is not exists", 403, 202);

  if (user.whenPasswordChanged) {
    const currentTimeStamp = parseInt(
      user.whenPasswordChanged.getTime() / 1000,
    );
    if (currentTimeStamp > decoded.iat)
      throw new AppError(
        "password had been changed after the Token created.login again",
        403,
        203,
      );
  }

  const role = user.role;
  if (role.fullAccess) {
    req.auth = { adminId: user._id.toString(), title };
    return next();
  }

  const permissions = Array.isArray(role.permissions)
    ? role.permissions
    : [];
  const hasPermission = permissions.includes(req.baseUrl);
  if (!hasPermission)
    throw new AppError(
      "user does not have the permission to use this url",
      403,
      204,
    );

  req.auth = { adminId: user._id.toString(), title };
  next();
});

const UserAuthorization = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer"))
    throw new AppError("Missing authorization header", 401, 210);

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, envConfig.JWT.secret);

  const user = await Accounts.findById(decoded.id);
  if (!user)
    throw new AppError("user is not exists", 401, 211);

  if (user.whenPasswordChanged) {
    const currentTimeStamp = parseInt(
      user.whenPasswordChanged.getTime() / 1000,
    );
    if (currentTimeStamp > decoded.iat)
      throw new AppError(
        "password had been changed after the Token created.login again",
        403,
        212,
      );
  }

  req.auth = { userId: user.id };
  next();
});

const activation = asyncHandler(async (req, res, next) => {
  const { id, token } = req.params;

  if (!token)
    throw new AppError("token is undefined", 401, 220);

  const decoded = jwt.verify(token, envConfig.Activation.secret);

  if (id != decoded.id)
    throw new AppError("this url is invalid", 401, 221);

  const user = await Accounts.findById(id);
  if (!user)
    throw new AppError("user isn`t exists", 401, 222);

  if (user.whenPasswordChanged) {
    const currentTimeStamp = parseInt(
      user.whenPasswordChanged.getTime() / 1000,
    );
    if (currentTimeStamp > decoded.iat)
      throw new AppError(
        "password had been changed after the url sent. login again",
        403,
        223,
      );
  }

  req.auth = { userId: user.id };
  next();
});

export default {
  AdminAuthorization,
  UserAuthorization,
  activation,
};
