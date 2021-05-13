const express = require("express");
const Comment = require("../models/comment-model");
const router = express.Router();
const comment = require("../models/comment-model");



//add a comment
router.post("/comment", async (req, res) => {
  const {comment} = req.body;
  if (!Comment) {
    res.status(400).json("missing fields");
    return;
  }
  try {
    const response = await Comment.create({
      user: req.user,
      comment,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//edit a comment
router.put("/comment/:id", async (req, res) => {
  try {
    const { comment } = req.body;
    await Comment.findByIdAndUpdate(req.params.id, {
      user: req.user,
      comment,
    });
    res.status(200).json(`Comment with id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

//delete a comment
router.delete("/comment/:id", async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.id);
    res.status(200).json(`Comment with id ${req.params.id} deleted`);
  } catch (e) {
    res.status(500).json(`error occured ${e}`);
  }
});

module.exports = router;