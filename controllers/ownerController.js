import Owner from "../models/ownersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
import ownerService from "../services/ownerService.js";

// @route   POST api/owner/login
// @desc    owner login
// @access  Private
const ownerlogin_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    // get email
    const owner = await Owner.findOne({ email }).populate("role");
    // create jwt token
    const Token = jwt.sign(
      { _id: owner._id, title: "Owner" },
      envConfig.JWT.secret,
      { expiresIn: envConfig.JWT.expire }
    );
    // response
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
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const changeOwnerPassword_patch = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const ownerId = req.auth.adminId;

    const owner = await Owner.findById(ownerId).select("+password");

    // check if old password is true
    const isMatch = await bcrypt.compare(oldPassword, owner.password);
    if (!isMatch)
      return res.status(400).send({ msg: "old password is not correct" });
    // check if newPassword equal confirmPassword
    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .send({ msg: "new password and confirm password are not equal" });
    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await ownerService.updateOwner(ownerId, { password: hashedPassword });
    // response
    return res.status(200).send({ msg: "password changed successfully" });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const updateOwner_put = async (req, res) => {
  try {
    const ownerId = req.auth.adminId;
    let data = req.body;
    const owner = await ownerService.updateOwner(ownerId, data);
    // response
    return res
      .status(200)
      .send({ msg: "owner updated successfully successfully", data: owner });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const ownerRest_delete = async (req, res) => {
  try {
    const ownerId = req.auth.adminId;
    const { password } = req.body;
    const owner = await Owner.findById(ownerId).select("+password");
    // check if password is true
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch)
      return res.status(400).send({ msg: "password is not correct" });
    // delete owner
    await ownerService.deleteOwner(ownerId);
    // response
    return res.status(200).send({ msg: "owner deleted successfully" });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default {
  ownerlogin_post,
  changeOwnerPassword_patch,
  updateOwner_put,
  ownerRest_delete,
};
