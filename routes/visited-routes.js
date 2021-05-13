const express = require("express");
const router = express.Router();
const Visited = require("../models/visited-model");

//visited page
router.get("/visited", async (req, res) => {
  try {
    const user = req.user;
    allVisited = await Visited.find({ user: user });
    res.status(200).json(allVisited);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//add to visited page
router.post("/visited", async (req, res) => {
  const { name, address } = req.body;
  if ( !name || !address) {
    res.status(400).json("missing fields");
    return;
  }
  try {
    const response = await Visited.create({
      user: req.user,
      name,
      address,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});


//remove from visited
router.delete("/visited/:id", async (req, res) => {
  try {
    await Visited.findByIdAndRemove(req.params.id);
    res.status(200).json(`Visted with id ${req.params.id} deleted`);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

module.exports = router;