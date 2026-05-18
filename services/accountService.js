import Accounts from "../models/accountsModel.js";

const addAccount = async (data) => {
  try {
    const newAccount = new Accounts(data);
    await newAccount.save();
    return newAccount;
  } catch (error) {
    throw error;
  }
};

const getAccount = async (data) => {
  try {
    const account = await Accounts.findOne(data);
    return account;
  } catch (error) {
    throw error;
  }
};

const getAccountById = async (id, select) => {
  try {
    const query = Accounts.findById(id).populate("role");
    if (select) query.select(select);
    const account = await query;
    return account;
  } catch (error) {
    throw error;
  }
};

const getAllAccounts = async (filter = {}) => {
  try {
    const accounts = await Accounts.find(filter).populate("role");
    return accounts;
  } catch (error) {
    throw error;
  }
};

const updateAccount = async (id, data) => {
  try {
    await Accounts.findByIdAndUpdate(id, data);
    const updatedAccount = await Accounts.findById(id);
    return updatedAccount;
  } catch (error) {
    throw error;
  }
};

const updateAccountPassword = async (id, hashedPassword) => {
  try {
    await Accounts.findByIdAndUpdate(id, {
      password: hashedPassword,
      whenPasswordChanged: Date.now(),
    });
    const updatedAccount = await Accounts.findById(id);
    return updatedAccount;
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (id) => {
  try {
    await Accounts.findByIdAndDelete(id);
    return;
  } catch (error) {
    throw error;
  }
};

const addReservation = async (userId, reservationData) => {
  try {
    const account = await Accounts.findByIdAndUpdate(
      userId,
      { $push: { reservations: reservationData } },
      { new: true }
    );
    return account;
  } catch (error) {
    throw error;
  }
};

const updateReservationStatus = async (userId, reservationId, status) => {
  try {
    const account = await Accounts.findOneAndUpdate(
      { _id: userId, "reservations._id": reservationId },
      { $set: { "reservations.$.stutus": status } },
      { new: true }
    );
    return account;
  } catch (error) {
    throw error;
  }
};

const activateAccount = async (id) => {
  try {
    await Accounts.findByIdAndUpdate(id, { activation: true });
    const account = await Accounts.findById(id);
    return account;
  } catch (error) {
    throw error;
  }
};

export default {
  addAccount,
  getAccount,
  getAccountById,
  getAllAccounts,
  updateAccount,
  updateAccountPassword,
  deleteAccount,
  addReservation,
  updateReservationStatus,
  activateAccount,
};