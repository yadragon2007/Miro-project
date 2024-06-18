import Owner from "../models/ownersModel.js";

const addOwner = async (ownerAccountData) => {
  try {
    const owner = new Owner(ownerAccountData);
    await owner.save();
    return;
  } catch (error) {
    return error;
  }
};

const getOwner = async (data) => {
  try {
    const role = await Owner.findOne(data);
    return role;
  } catch (error) {
    return error;
  }
};

export default {
  addOwner,
  getOwner,
};
