import mongoose from "mongoose";

const VideLinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
});

const VideoLink = mongoose.model("VideoLink", VideLinkSchema);

export default VideoLink;
