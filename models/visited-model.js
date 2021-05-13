const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const visitedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  address: String,
});

const Visited = model("Visited", visitedSchema);
module.exports = Visited;
