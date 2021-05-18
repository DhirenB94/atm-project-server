const express = require("express");
const router = express.Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const {name, comment, lat, long} = req.body;
  try {
    const savedPin = await Pin.create({
      name,
      comment,
      lat,
      long,
      username: req.user.username
    });
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;