const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: String,
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;