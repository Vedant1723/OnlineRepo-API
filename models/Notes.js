const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: "Title of the Notes is required!",
  },
  fileDescription: {
    type: String,
  },
  file: {
    type: String,
  },
  course: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Notes = mongoose.model("Notes", NotesSchema);
