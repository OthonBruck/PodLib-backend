const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "no title"],
  },
  description: {
    type: String,
    required: [true, "no description"],
  },
  link: {
    type: String,
    required: [true, "no link"],
  },
  episodes: [
    {
      title: { type: String },
      date: { type: String },
      link: { type: String },
      ratings: { type: String },
    },
  ],
});

const Podcast = (module.exports = mongoose.model("podcast", PodcastSchema));
