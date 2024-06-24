import Owner from "../models/ownersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

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
    res.status(200).send({ msg: "loged in successflly", data: owner, Token });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const changeOwnerUserNameAndPassword = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default { ownerlogin_post, changeOwnerUserNameAndPassword };
