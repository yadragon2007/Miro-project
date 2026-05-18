import bcrypt from "bcrypt";
import employeeService from "../services/employeeService.js";
import JWT from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const sanitizeEmployee = (employee) => ({
  _id: employee._id,
  fullName: employee.fullName,
  email: employee.email,
  role: employee.role,
});

const addEmployee_post = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = { fullName, email, password: hashedPassword, role };
    // save employee to db
    const employee = await employeeService.addEmployee(data);
    // create Token
    const Token = JWT.sign(
      { _id: employee._id, title: "Employee" },
      envConfig.JWT.secret,
      {
        expiresIn: envConfig.JWT.expire,
      }
    );
    res.status(201).json({ employee: sanitizeEmployee(employee), Token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

const employeeLogin_post = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await employeeService.getEmpolyee({ email });
    // create Token
    const Token = JWT.sign(
      { _id: employee._id, title: "Employee" },
      envConfig.JWT.secret,
      {
        expiresIn: envConfig.JWT.expire,
      }
    );
    // response
    res.status(200).json({ employee: sanitizeEmployee(employee), Token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: `Internal Server Error` });
  }
};

export default {
  addEmployee_post,
  employeeLogin_post,
};
