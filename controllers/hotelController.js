import Hotels from "../models/hotelModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const addHotel_post = asyncHandler(async (req, res) => {
  let { hotel } = req.body;
  for (let i = 0; i < hotel.rooms.length; i++) {
    hotel.rooms[i].bookedRooms = 0;
    hotel.rooms[i].emptyRooms = hotel.rooms[i].numberOfRooms;
  }
  await hotel.save();
  res.status(201).send("hotel added successfully");
});

const getAllHotels_get = asyncHandler(async (req, res) => {
  const filter = {};
  for (const key of ["name", "stars", "currency"]) {
    if (req.query[key] !== undefined) filter[key] = req.query[key];
  }
  const hotels = await Hotels.find(filter);
  res.status(200).send(hotels);
});

const getSpecificHotel_post = asyncHandler(async (req, res) => {
  const { id, name } = req.body;
  if (id && name) {
    const data = { _id: id, name: name };
    const hotel = await Hotels.findOne(data);
    if (hotel) return res.status(200).send(hotel);
    throw new AppError("There is not hotel with those id and name", 400, 500);
  } else if (id) {
    const hotel = await Hotels.findById(id);
    return res.status(200).send(hotel);
  } else {
    const hotel = await Hotels.findOne({ name: name });
    return res.status(200).send(hotel);
  }
});

const updateHotel_put = asyncHandler(async (req, res) => {
  const { hotelId, name, description, stars, location, phone } = req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (stars !== undefined) data.stars = stars;
  if (location !== undefined) data.location = location;
  if (phone !== undefined) data.phone = phone;
  await Hotels.findByIdAndUpdate(hotelId, data);
  res.status(200).send("hotel updated successfully");
});

const deleteHotel_delete = asyncHandler(async (req, res) => {
  const { id } = req.headers;
  await Hotels.findByIdAndDelete(id);
  return res.status(200).send("hotel deleted successfully");
});

const addImages_patch = asyncHandler(async (req, res) => {
  const { images } = req.body;
  const { hotelid } = req.headers;
  const hotel = await Hotels.findById(hotelid);
  let newImages = hotel.images;
  Object.keys(images).forEach((folder) => {
    if (newImages[folder])
      newImages[folder] = [...newImages[folder], ...images[folder]];
    else newImages[folder] = images[folder];
  });
  await Hotels.findByIdAndUpdate(hotelid, { images: newImages });
  res.status(200).send({ msg: "images added successfully" });
});

const deleteImages_delete = asyncHandler(async (req, res) => {
  const { deletedImages, hotelId } = req.body;
  const hotel = await Hotels.findById(hotelId);
  let hotelImages = hotel.images;
  for (let i = 0; i < deletedImages.length; i++) {
    const { imageName, imageFolder } = deletedImages[i];
    hotelImages[imageFolder].splice(
      hotelImages[imageFolder].indexOf(imageName),
      1
    );
  }
  await Hotels.findByIdAndUpdate(hotelId, { images: hotelImages });
  return res.status(200).send("images deleted successfully");
});

const hotelUpdate_patch = asyncHandler(async (req, res) => {
  const { hotelId } = req.body;
  for (let i = 0; i < req.body.rooms.length; i++) {
    req.body.rooms[i].bookedRooms = 0;
    req.body.rooms[i].emptyRooms = req.body.rooms[i].numberOfRooms;
  }
  let data = req.body;
  delete data.hotelId;
  const keys = Object.keys(data);
  let hotel = await Hotels.findById(hotelId);
  keys.forEach((key) => (hotel[key] = [...hotel[key], ...data[key]]));
  await hotel.save();
  return res.status(200).send(`data added successfully [${keys}]`);
});

const deleteHotelData_delete = asyncHandler(async (req, res) => {
  const { hotelId } = req.body;
  let hotel = await Hotels.findById(hotelId);
  let data = req.body;
  delete data.hotelId;
  const keys = Object.keys(data);
  keys.forEach((key) => {
    data[key].forEach((field) => {
      const property = hotel[key].find((r) => r.name === field);
      hotel[key].splice(hotel[key].indexOf(property), 1);
    });
  });
  await hotel.save();
  return res.status(200).send(`data deleted successfully [${keys}]`);
});

const modifyHotelData_patch = asyncHandler(async (req, res) => {
  const { hotelId } = req.body;
  let hotel = await Hotels.findById(hotelId);
  let data = req.body;
  delete data.hotelId;
  const Holelkeys = Object.keys(data);
  Holelkeys.forEach((hotelKey) => {
    for (let i = 0; i < data[hotelKey].length; i++) {
      const property = hotel[hotelKey].find(
        (r) => r.name === data[hotelKey][i].name
      );
      const hotelDataIndex = hotel[hotelKey].indexOf(property);
      const newDataKeys = Object.keys(data[hotelKey][i].newData);
      newDataKeys.forEach((newDataKey) => {
        hotel[hotelKey][hotelDataIndex][newDataKey] =
          data[hotelKey][i].newData[newDataKey];
      });
    }
  });
  await Hotels.findByIdAndUpdate(hotelId, hotel);
  return res.status(200).send(`data modified successfully [${Holelkeys}]`);
});

export default {
  addHotel_post,
  getAllHotels_get,
  getSpecificHotel_post,
  updateHotel_put,
  deleteHotel_delete,
  addImages_patch,
  deleteImages_delete,
  hotelUpdate_patch,
  deleteHotelData_delete,
  modifyHotelData_patch,
};
