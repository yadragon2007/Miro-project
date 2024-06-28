import Owner from "../models/ownersModel.js";


// const createOwnerWithDefultData = async () => {
  
// }

const addOwner = async (ownerAccountData) => {
  try {
    const owner = new Owner(ownerAccountData);
    await owner.save();
    return;
  } catch (error) {
    if (error) throw error;
  }
};

const getOwner = async (data) => {
  try {
    const role = await Owner.findOne(data);
    return role;
  } catch (error) {
    if (error) throw error;
  }
};

const updateOwner = async (id, data) => {
  try {
    await Owner.findByIdAndUpdate(id, data);
    const role = await Owner.findById(id);
    return role;
  } catch (error) {
    if (error) throw error;
  }
};

const deleteOwner = async (id) => {
  try {
    await Owner.findByIdAndDelete(id);
    return;
  } catch (error) {
    if (error) throw error;
  }
};

export default {
  addOwner,
  getOwner,
  updateOwner,
  deleteOwner
};
