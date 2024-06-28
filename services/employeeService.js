import Employee from "../models/employeeModel.js";

const addEmployee = async (data) => {
  try {
    const newEmployee = new Employee(data);
    await newEmployee.save();
    return newEmployee;
  } catch (error) {
    throw error;
  }
};

const getEmpolyee = async (data) => {
  try {
    const employee = await Employee.findOne(data);
    return employee;
  } catch (error) {
    throw error;
  }
};

export default {
  addEmployee,
  getEmpolyee,
};
