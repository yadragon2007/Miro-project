import Accounts from "../models/accountsModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import envConfig from "../config/envConfig.js";
import accountService from "../services/accountService.js";

// @route   POST api/activation/
// @desc    Send activation url
// @access  Public
const account_activation_post = async (req, res) => {
  const { userId } = req.body;
  if (req.auth.userId !== userId) {
    return res.status(403).send({ message: "Not authorized to request activation for this user" });
  }
  const userData = await accountService.getAccountById(userId);
  // check if user is already activated
  if (userData.activation)
    return res.status(200).send("user account is already activated");

  try {
    const activationCode = crypto.randomInt(100000, 999999);
    const Token = jwt.sign(
      { id: userData._id, activationCode },
      envConfig.Activation.secret,
      {
        expiresIn: envConfig.Activation.expire,
      }
    );
    const url = `${req.protocol}://${req.get("host")}/api/activation/${
      userData._id
    }/${Token}`;

    await sendMail(userData.email, url);

    return res
      .status(200)
      .send(
        `email has been sent successflly. link expires in ${envConfig.Activation.expire}`
      );
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error", type: "creating activation code" });
  }

  async function sendMail(email, url) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: envConfig.Email.email,
          pass: envConfig.Email.password,
        },
      });

      const info = await transporter.sendMail({
        from: envConfig.Email.email,
        to: email,
        subject: "activation link",
        text: url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error", type: "sending email" });
    }
  }
};

// @route   GET api/activation/:id/:token
// @desc    check if token is valid
// @access  Public
const check_account_activation_get = async (req, res) => {
  const { id } = req.params;

  await accountService.updateAccount(id, { activation: true });
  const user = await accountService.getAccount(id);

  return res
    .status(200)
    .send({ message: "account has been activated successflly", data: user });
};

export default {
  account_activation_post,
  check_account_activation_get,
};
