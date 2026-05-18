import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Hotels from "../models/hotelModel.js";

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

// add hotel folder
const addHotelFolder = async (req, res, next) => {
  try {
    const hotel = new Hotels({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    req.body.hotel = hotel;
    const id = hotel._id.toString();
    // make hotel folder path
    const folderPath = buildUploadsPath(id);
    //create hotel folder
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        return console.log(`Error creating folder: ${err.message}`);
      }
    });
    // create images folder
    const imagesFolder = path.join(folderPath, "images");
    fs.mkdir(imagesFolder, { recursive: true }, (err) => {
      if (err) {
        return console.log(`Error creating folder: ${err.message}`);
      }
    });

    // the end
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// delete hotel folder
const deleteHotelFolder = async (req, res, next) => {
  const { id } = req.headers;
  const hotel = await Hotels.findById(id);

  // make hotel img folder
  const folderPath = buildUploadsPath(id);
  // delete folder
  fs.rmSync(folderPath, { recursive: true, force: true });

  next();
};

// add hotel images

const destination = async (req, file, cb) => {
  // get hotel data
  const { hotelid: id } = req.headers;
  const hotel = await Hotels.findById(id);
  req.hotelIdForFileName = hotel._id;
  // make hotel img folder
  const folderPath = buildUploadsPath(id, "images", file.fieldname);
  //create folder
  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      return console.log(`Error creating folder: ${err.message}`);
    }
  });
  // select folder
  cb(null, folderPath);
};

const filename = async (req, file, cb) => {
  if (!acceptedMimeTypes.has(file.mimetype)) {
    return cb(new Error(`File type not allowed "${file.mimetype}"`), false);
  }

  // check file extension
  const acceptedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".jfif",
    ".pjpeg",
    ".pjp",
  ];
  const extension = path.extname(file.originalname);
  const check = acceptedExtensions.includes(extension);
  if (!check) {
    return cb(
      new Error(`File extension not allowed "${file.originalname}"`),
      false
    );
  }

  // file name handling
  const uniqueSuffix = Date.now();
  const fileName =
    req.hotelIdForFileName +
    "-" +
    file.fieldname +
    "-" +
    uniqueSuffix +
    path.extname(file.originalname);

  // add file to req.body
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
  // save file
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

// delete hotel images

const deleteHotelImages = async (req, res, next) => {
  const { hotelId, deletedImages } = req.body;
  const hotel = await Hotels.findById(hotelId);

  // get path
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
