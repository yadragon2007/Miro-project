import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Hotels from "../models/hotelModel.js";

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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const previousFolder = path.join(__dirname, "..");
    const folderPath = path.join(
      previousFolder,
      `/public/uploads/hotels/${id}`
    );
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
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const previousFolder = path.join(__dirname, "..");
  // folder path
  const folderPath = path.join(previousFolder, `/public/uploads/hotels/${id}`);
  // delete folder
  fs.rmSync(folderPath, { recursive: true, force: true });

  next();
};

// add hotel images

const destination = async (req, file, cb) => {
  // get hotel data
  const { hotelid: id } = req.headers;
  const hotel = await Hotels.findById(id);
  // make hotel img folder
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const previousFolder = path.join(__dirname, "..");
  // folder path
  const folderPath = path.join(
    previousFolder,
    `/public/uploads/hotels/${id}/images/${file.fieldname}`
  );
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
  const { hotelid: id } = req.headers;
  const hotel = await Hotels.findById(id);

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
    hotel._id +
    "-" +
    file.fieldname +
    "-" +
    uniqueSuffix +
    path.extname(file.originalname);

  // add file to req.body
  const folderName = file.fieldname;
  if (req.body.images) {
    // req.body.images.push({ imageName: fileName, imageFolder: file.fieldname });
    if (req.body.images[folderName]) req.body.images[folderName].push(fileName);
    else {
      req.body.images[folderName] = [];
      req.body.images[folderName].push(fileName);
    }
  } else {
    req.body.images = {};
    // req.body.images.push({ imageName: fileName, imageFolder: file.fieldname });
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

const upload = multer({ storage: storage });

// delete hotel images

const deleteHotelImages = async (req, res, next) => {
  const { hotelId, deletedImages } = req.body;
  const hotel = await Hotels.findById(hotelId);

  // delete images files
  // get path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const previousFolder = path.join(__dirname, "..");
  // folder path
  const folderPath = path.join(
    previousFolder,
    `/public/uploads/hotels/${hotelId}/images/`
  );

  deletedImages.forEach((deletedImage) => {
    const imagePath = path.join(
      folderPath,
      `${deletedImage.imageFolder}/${deletedImage.imageName}`
    );
    fs.unlinkSync(imagePath);
  });

  next();
};

export default {
  addHotelFolder,
  upload,
  deleteHotelFolder,
  deleteHotelImages,
};
