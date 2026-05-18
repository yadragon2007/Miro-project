import PromoCode from "../models/promoCodeModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const addPromoCode_post = asyncHandler(async (req, res) => {
  const { code, expirationDate, forAllHotels, Hotels, forAllUsers, users, usedOneTimeOfUser, offer, infintyTimesToUse, howManyToUse } = req.body;
  const data = { code, expirationDate, forAllHotels, Hotels, forAllUsers, users, usedOneTimeOfUser, offer, infintyTimesToUse, howManyToUse };
  const newPromoCode = new PromoCode(data);
  await newPromoCode.save();
  return res.status(201).send({
    msg: "promoCode add successfully",
    data: newPromoCode,
  });
});

const getAllPromoCode_get = asyncHandler(async (req, res) => {
  const filter = {};
  for (const key of ["code", "forAllHotels", "forAllUsers"]) {
    if (req.query[key] !== undefined) filter[key] = req.query[key];
  }
  const allPromoCodes = await PromoCode.find(filter);
  return res.status(200).send({
    msg: "promoCodes have been got successfully",
    data: allPromoCodes,
  });
});

const getPromoCode_post = asyncHandler(async (req, res) => {
  const { promoCodeId: id } = req.body;
  const promoCode = await PromoCode.findById(id);
  return res.status(200).send({
    msg: "promoCode has been got successfully",
    data: promoCode,
  });
});

const updatePromoCode_put = asyncHandler(async (req, res) => {
  const { promoCodeId } = req.body;
  const allowedFields = ["expirationDate", "forAllHotels", "acceptedHotels", "forAllUsers", "users", "usedOneTimeOfUser", "offer", "infintyTimesToUse", "howManyToUse"];
  const data = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) data[key] = req.body[key];
  }
  await PromoCode.findByIdAndUpdate(promoCodeId, data);
  const newPromoCode = await PromoCode.findById(promoCodeId);
  return res.status(200).send({
    msg: "promoCode updated successfully",
    data: newPromoCode,
  });
});

const deletePromoCode_delete = asyncHandler(async (req, res) => {
  const { promoCodeId } = req.body;
  await PromoCode.findByIdAndDelete(promoCodeId);
  return res.status(200).send({
    msg: "promoCode deleted successfully",
  });
});

export default {
  addPromoCode_post,
  getAllPromoCode_get,
  getPromoCode_post,
  updatePromoCode_put,
  deletePromoCode_delete,
};
