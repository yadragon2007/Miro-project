import PromoCode from "../models/promoCodeModel.js";

const buildSafeFilter = (query, allowedKeys) => {
  const safeFilter = {};
  for (const key of allowedKeys) {
    const value = query[key];
    if (value === undefined) continue;
    if (typeof value === "string" && value.includes("$")) continue;
    safeFilter[key] = value;
  }
  return safeFilter;
};

const addPromoCode_post = async (req, res) => {
  try {
    const newPromoCode = new PromoCode(req.body);
    await newPromoCode.save();
    return res.status(201).send({
      msg: "promoCode add successfully",
      data: newPromoCode,
    });
  } catch (error) {
    res.status(500).send({ msg: "server error", error });
  }
};

const getAllPromoCode_get = async (req, res) => {
  try {
    const filter = buildSafeFilter(req.query, ["code", "forAllHotels", "forAllUsers"]);
    const allPromoCodes = await PromoCode.find(filter);
    return res.status(200).send({
      msg: "promoCodes have been got successfully",
      data: allPromoCodes,
    });
  } catch (error) {
    res.status(500).send({ msg: "server error", error });
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
    res.status(500).send({ msg: "server error", error });
  }
};

const updatePromoCode_put = async (req, res) => {
  const { promoCodeId } = req.body;
  let data = req.body;
  delete data.promoCodeId;
  try {
    await PromoCode.findByIdAndUpdate(promoCodeId, data);
    const newPromoCode = await PromoCode.findById(promoCodeId);

    return res.status(200).send({
      msg: "promoCode updated successfully",
      data: newPromoCode,
    });
  } catch (error) {
    res.status(500).send({ msg: "server error", error });
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
    res.status(500).send({ msg: "server error", error });
  }
};

export default {
  addPromoCode_post,
  getAllPromoCode_get,
  getPromoCode_post,
  updatePromoCode_put,
  deletePromoCode_delete,
};
