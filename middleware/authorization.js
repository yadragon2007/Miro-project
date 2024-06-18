import Accounts from "../models/accountsModel.js";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const AdminAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({
      type: "authorization",
      code: "00",
      message: "Missing authorization header",
    });
  } else {
    try {
      const token = authorization.split(" ")[1]; //retrieve the token part only
      // verify Token
      const decoded = jwt.verify(token, envConfig.JWT.secret);
      // check if user is exists
      const user = await Accounts.findById(decoded.id);
      if (!user)
        return res.status(401).send({
          type: "authorization",
          code: "01",
          message: "user is not exists",
        });
      // Check User Role
      if (decoded.access !== "admin")
        return res.status(401).send({
          type: "authorization",
          code: "03",
          message: "user is not a admin",
        });
      // check if password has not changed after creating the Token
      if (user.whenPasswordChanged) {
        const currentTimeStamp = parseInt(
          user.whenPasswordChanged.getTime() / 1000
        );

        if (currentTimeStamp > decoded.iat) {
          return res.status(403).send({
            type: "authorization",
            code: "04",
            message:
              "password had been changed after the Token created.login again",
          });
        }
      }
      return next();
    } catch (error) {
      res
        .status(403)
        .send({ type: "authorization", code: "02", message: error.message });
    }
  }
};

const UserAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({
      type: "authorization",
      code: "00",
      message: "Missing authorization header",
    });
  } else {
    try {
      const token = authorization.split(" ")[1]; //retrieve the token part only
      // verify Token
      const decoded = jwt.verify(token, envConfig.JWT.secret);
      // check if user is exists
      const user = await Accounts.findById(decoded.id);
      if (!user)
        return res.status(401).send({
          type: "authorization",
          code: "01",
          message: "user is not exists",
        });
      // check if password has not changed after creating the Token
      if (user.whenPasswordChanged) {
        const currentTimeStamp = parseInt(
          user.whenPasswordChanged.getTime() / 1000
        );

        if (currentTimeStamp > decoded.iat) {
          return res.status(403).send({
            type: "authorization",
            code: "04",
            message:
              "password had been changed after the Token created.login again",
          });
        }
      }
      // add user to request object
      req.body.userId = user._id;

      return next();
    } catch (error) {
      res
        .status(403)
        .send({ type: "authorization", code: "02", message: error.message });
    }
  }
};

const activation = async (req, res, next) => {
  const { id, token } = req.params;
  try {
    if (!token)
      return res.status(401).send({
        type: "authorization",
        code: "01",
        message: "token is undefined",
      });

    // check if token in valid

    const decoded = jwt.verify(token, envConfig.Activation.secret);

    // check if the token id == user id

    if (id != decoded.id)
      return res.status(401).send({
        type: "authorization",
        code: "03",
        message: "this url is invalid",
      });

    // check if user exists

    const user = await Accounts.findById(id);
    if (!user)
      return res.status(401).send({
        type: "authorization",
        code: "04",
        message: "user isn`t exists",
      });

    // check if password has not changed after creating the Token

    if (user.whenPasswordChanged) {
      const currentTimeStamp = parseInt(
        user.whenPasswordChanged.getTime() / 1000
      );

      if (currentTimeStamp > decoded.iat) {
        return res.status(403).send({
          type: "authorization",
          code: "05",
          message: "password had been changed after the url sent. login again",
        });
      }
    }
    return next();
  } catch (error) {
    res
      .status(401)
      .send({ type: "authorization", code: "02", message: error.message });
  }
};

const authorization = async (req, res, next) => {};

export default {
  AdminAuthorization,
  UserAuthorization,
  activation,
};
