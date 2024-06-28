import bcrypt from "bcrypt";
import employeeService from "../services/employeeService.js";
import JWT from "jsonwebtoken";
import envConfig from "../confg/envConfig.js";

const addEmployee_post = async (req, res) => {
  try {
    const { password } = req.body;
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    // save employee to db
    const employee = await employeeService.addEmployee(req.body);
    // create Token
    const Token = JWT.sign(
      { _id: employee._id, title: "Employee" },
      envConfig.JWT.secret,
      {
        expiresIn: envConfig.JWT.expire,
      }
    );
    res.status(201).json({ employee, Token });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

const employeeLogin_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    const empoyee = await employeeService.getEmpolyee({ email });
    // create Token
    const Token = JWT.sign(
      { _id: employee._id, title: "Employee" },
      envConfig.JWT.secret,
      {
        expiresIn: envConfig.JWT.expire,
      }
    );
    // response
    res.status(200).json({ employee, Token });
  } catch (error) {
    return res.status(500).send({ msg: `Internal Server Error`, error });
  }
};

export default {
  addEmployee_post,
  employeeLogin_post,
};
