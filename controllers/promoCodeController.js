import PromoCode from "../models/promoCodeModel.js";

const addPromoCode_post = async (req, res) => {
  try {
    const { code, expirationDate, forAllHotels, Hotels, forAllUsers, users, usedOneTimeOfUser, offer, infintyTimesToUse, howManyToUse } = req.body;
    const data = { code, expirationDate, forAllHotels, Hotels, forAllUsers, users, usedOneTimeOfUser, offer, infintyTimesToUse, howManyToUse };
    const newPromoCode = new PromoCode(data);
    await newPromoCode.save();
    return res.status(201).send({
      msg: "promoCode add successfully",
      data: newPromoCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "server error" });
  }
};

const getAllPromoCode_get = async (req, res) => {
  try {
    const filter = {};
    for (const key of ["code", "forAllHotels", "forAllUsers"]) {
      if (req.query[key] !== undefined) filter[key] = req.query[key];
    }
    const allPromoCodes = await PromoCode.find(filter);
    return res.status(200).send({
      msg: "promoCodes have been got successfully",
      data: allPromoCodes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "server error" });
  }
};

const getPromoCode_post = async (req, res) => {
  const { promoCodeId: id } = req.body;

  try {
    const promoCode = await PromoCode.findById(id);

    return res.status(200).send({
      msg: "promoCode has been got successfully",
      data: promoCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "server error" });
  }
};

const updatePromoCode_put = async (req, res) => {
  const { promoCodeId } = req.body;
  const allowedFields = ["expirationDate", "forAllHotels", "acceptedHotels", "forAllUsers", "users", "usedOneTimeOfUser", "offer", "infintyTimesToUse", "howManyToUse"];
  const data = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) data[key] = req.body[key];
  }
  try {
    await PromoCode.findByIdAndUpdate(promoCodeId, data);
    const newPromoCode = await PromoCode.findById(promoCodeId);

    return res.status(200).send({
      msg: "promoCode updated successfully",
      data: newPromoCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "server error" });
  }
};

const deletePromoCode_delete = async (req, res) => {
  const { promoCodeId } = req.body;

  try {
    await PromoCode.findByIdAndDelete(promoCodeId);
    return res.status(200).send({
      msg: "promoCode deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "server error" });
  }
};

export default {
  addPromoCode_post,
  getAllPromoCode_get,
  getPromoCode_post,
  updatePromoCode_put,
  deletePromoCode_delete,
};
