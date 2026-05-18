import mongoose from "mongoose";
import envConfig from "./envConfig.js";
import { runSeeding } from "../utils/startup.js";

const database_conection = async () => {
  await mongoose.connect(envConfig.dbUri);
  console.log("Connected to MongoDB");
  await runSeeding();
};

export default { database_conection };
