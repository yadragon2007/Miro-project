import mongoose from "mongoose";
import envConfig from "./envConfig.js";

const database_conection = async () => {
  // Handle database
  await mongoose.connect("mongodb://localhost:27017/miroProject");
};

export default { database_conection };
