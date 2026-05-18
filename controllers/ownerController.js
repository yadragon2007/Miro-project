import Owner from "../models/ownersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import ownerService from "../services/ownerService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const ownerlogin_post = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email }).populate("role");
  const Token = jwt.sign(
    { _id: owner._id, title: "Owner" },
    envConfig.JWT.secret,
    { expiresIn: envConfig.JWT.expire }
  );
  res.status(200).send({
    msg: "loged in successfully",
    data: {
      _id: owner._id,
      fullName: owner.fullName,
      email: owner.email,
      role: owner.role,
    },
    Token,
  });
});

const changeOwnerPassword_patch = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const ownerId = req.auth.adminId;
  const owner = await Owner.findById(ownerId).select("+password");
  const isMatch = await bcrypt.compare(oldPassword, owner.password);
  if (!isMatch) throw new AppError("old password is not correct", 400, 800);
  if (newPassword !== confirmPassword)
    throw new AppError("new password and confirm password are not equal", 400, 801);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await ownerService.updateOwner(ownerId, { password: hashedPassword });
  return res.status(200).send({ msg: "password changed successfully" });
});

const updateOwner_put = asyncHandler(async (req, res) => {
  const ownerId = req.auth.adminId;
  const { fullName, email } = req.body;
  const data = {};
  if (fullName !== undefined) data.fullName = fullName;
  if (email !== undefined) data.email = email;
  const owner = await ownerService.updateOwner(ownerId, data);
  return res
    .status(200)
    .send({ msg: "owner updated successfully successfully", data: owner });
});

const ownerRest_delete = asyncHandler(async (req, res) => {
  const ownerId = req.auth.adminId;
  const { password } = req.body;
  const owner = await Owner.findById(ownerId).select("+password");
  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) throw new AppError("password is not correct", 400, 802);
  await ownerService.deleteOwner(ownerId);
  return res.status(200).send({ msg: "owner deleted successfully" });
});

export default {
  ownerlogin_post,
  changeOwnerPassword_patch,
  updateOwner_put,
  ownerRest_delete,
};
