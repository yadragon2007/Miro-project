import Role from "../models/roleModel.js";
import Owner from "../models/ownersModel.js";
import RoleServes from "../services/RoleServes.js";
import bcrypt from "bcrypt";
import envConfig from "../config/envConfig.js";
import ownerService from "../services/ownerService.js";

const seedOwnerRole = async () => {
  const ownerRole = await Role.findOne({ roleName: "owner" });
  if (!ownerRole) {
    await RoleServes.addRole({
      roleName: "owner",
      description: "Owner Role",
      fullAccess: true,
    });
    console.log("Seeded: owner role created");
  }
};

const seedUserRole = async () => {
  const userRole = await Role.findOne({ roleName: "user" });
  if (!userRole) {
    await RoleServes.addRole({
      roleName: "user",
      description: "user Role",
      fullAccess: true,
    });
    console.log("Seeded: user role created");
  }
};

const seedDefaultOwner = async () => {
  const ownerAccount = await Owner.find();
  if (ownerAccount.length === 0) {
    const ownerRoleDoc = await RoleServes.getRole({ roleName: "owner" });
    if (!ownerRoleDoc) throw new Error("Owner role not found during seeding");

    const hashedPassword = await bcrypt.hash(envConfig.Owner.password, 10);
    await ownerService.addOwner({
      fullName: "owner",
      email: envConfig.Owner.email,
      password: hashedPassword,
      default: true,
      role: ownerRoleDoc._id,
    });
    console.log("Seeded: default owner account created");
  }
};

export const runSeeding = async () => {
  await seedOwnerRole();
  await seedUserRole();
  await seedDefaultOwner();
};
