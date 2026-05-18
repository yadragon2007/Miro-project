import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Hotels from "../models/hotelModel.js";
import AppError from "../utils/AppError.js";

const acceptedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/jfif",
]);

const buildUploadsPath = (...parts) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "..", "public", "uploads", "hotels", ...parts);
};

const addHotelFolder = async (req, res, next) => {
  try {
    const hotel = new Hotels({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    req.body.hotel = hotel;
    const id = hotel._id.toString();
    const folderPath = buildUploadsPath(id);
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        return console.log(`Error creating folder: ${err.message}`);
      }
    });
    const imagesFolder = path.join(folderPath, "images");
    fs.mkdir(imagesFolder, { recursive: true }, (err) => {
      if (err) {
        return console.log(`Error creating folder: ${err.message}`);
      }
    });
    next();
  } catch (error) {
    next(new AppError("Failed to create hotel folders", 500, 501));
  }
};

const deleteHotelFolder = async (req, res, next) => {
  const { id } = req.headers;
  const hotel = await Hotels.findById(id);
  const folderPath = buildUploadsPath(id);
  fs.rmSync(folderPath, { recursive: true, force: true });
  next();
};

const destination = async (req, file, cb) => {
  const { hotelid: id } = req.headers;
  const hotel = await Hotels.findById(id);
  req.hotelIdForFileName = hotel._id;
  const folderPath = buildUploadsPath(id, "images", file.fieldname);
  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      return console.log(`Error creating folder: ${err.message}`);
    }
  });
  cb(null, folderPath);
};

const filename = async (req, file, cb) => {
  if (!acceptedMimeTypes.has(file.mimetype)) {
    return cb(new Error(`File type not allowed "${file.mimetype}"`), false);
  }

  const acceptedExtensions = [
    ".png", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp",
  ];
  const extension = path.extname(file.originalname);
  const check = acceptedExtensions.includes(extension);
  if (!check) {
    return cb(
      new Error(`File extension not allowed "${file.originalname}"`),
      false
    );
  }

  const uniqueSuffix = Date.now();
  const fileName =
    req.hotelIdForFileName +
    "-" +
    file.fieldname +
    "-" +
    uniqueSuffix +
    path.extname(file.originalname);

  const folderName = file.fieldname;
  if (req.body.images) {
    if (req.body.images[folderName]) req.body.images[folderName].push(fileName);
    else {
      req.body.images[folderName] = [];
      req.body.images[folderName].push(fileName);
    }
  } else {
    req.body.images = {};
    if (req.body.images[folderName]) req.body.images[folderName].push(fileName);
    else {
      req.body.images[folderName] = [];
      req.body.images[folderName].push(fileName);
    }
  }
  cb(null, fileName);
};

const storage = multer.diskStorage({
  destination,
  filename,
});

const uploadConfig = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const deleteHotelImages = async (req, res, next) => {
  const { hotelId, deletedImages } = req.body;
  const hotel = await Hotels.findById(hotelId);
  const folderPath = buildUploadsPath(hotelId, "images");

  deletedImages.forEach((deletedImage) => {
    const folder = path.basename(deletedImage.imageFolder);
    const name = path.basename(deletedImage.imageName);
    const imagePath = path.join(folderPath, folder, name);
    const resolved = path.resolve(imagePath);
    if (!resolved.startsWith(path.resolve(folderPath))) {
      return console.log(`Invalid image path rejected: ${imagePath}`);
    }
    if (fs.existsSync(resolved)) {
      fs.unlinkSync(resolved);
    }
  });

  next();
};

export default {
  addHotelFolder,
  upload: uploadConfig,
  deleteHotelFolder,
  deleteHotelImages,
};
