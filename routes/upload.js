var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;
const uniqid = require("uniqid");
const fs = require("fs");

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;

  const resultMove = await req.files.photoFromFront.mv(photoPath);
  // const galleryMove = await req.files.photoFromGallery.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }

  // if (!galleryMove) {
  //   const resultCloudinary = await cloudinary.uploader.upload(photoPath);
  //   res.json({ result: true, url: resultCloudinary.secure_url });
  // } else {
  //   res.json({ result: false, error: galleryMove });
  // }

  fs.unlinkSync(photoPath);
});

module.exports = router;
