import Owner from "../models/ownersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const ownerlogin_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check email
    const owner = await Owner.findOne({ email }).populate("role");
    // console.log(owner);
    if (!owner) return res.status(400).json({ message: "Invalid email" });
    // check password
    const passwordCheck = await bcrypt.compare(password, owner.password);
    if (!passwordCheck)
      return res.status(400).json({ message: "Invalid password" });
    // create jwt token
    const Token = jwt.sign(
      { _id: owner._id, role: owner.role },
      envConfig.JWT.secret,
      { expiresIn: envConfig.JWT.expire }
    );
    // response
    res.status(200).send({ msg: "loged in successflly", data: owner, Token });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};
export default { ownerlogin_post };
