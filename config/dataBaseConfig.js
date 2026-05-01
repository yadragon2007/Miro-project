import mongoose from "mongoose";
import envConfig from "./envConfig.js";

const database_conection = async () => {
  await mongoose.connect(envConfig.dbUri);
};

export default { database_conection };
