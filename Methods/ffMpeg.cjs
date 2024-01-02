const moment = require("moment");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const OutputDirectory = path.join(__dirname, "../Public/ReportImages");
const parentDirectory = path.join(__dirname, "../Public/");

const extractImages = async (timestamp, name, inputVideoPath) => {
  let nameOfImages = "";
  // timestamps.forEach((timestamp, index) => {

  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }

  if (!fs.existsSync(OutputDirectory)) {
    fs.mkdirSync(OutputDirectory, { recursive: true });
  }

  console.log("Current Working Directory:", process.cwd());
  console.log("Parent Directory:", parentDirectory);
  console.log("Report Images Directory:", OutputDirectory);
  const updateDate = moment(new Date()).format("YYYY-MM-DD_HH-mm-ss");
  const outputFilename = `${updateDate}_${name}.jpg`; // Output image filename
  const outputPath = path.join(OutputDirectory, outputFilename);
  // Run FFmpeg command to extract image
  ffmpeg(inputVideoPath)
    .seekInput(timestamp)
    .output(outputPath)
    .format("image2") // Specify the output format
    .videoCodec("mjpeg")
    .on("end", () => {
      console.log(`Image ${name} extracted at timestamp ${timestamp}s`);
      nameOfImages = `${process.env.SERVER_LINK}/Public/ReportImages/${outputFilename}`;
    })
    .on("error", (err) => {
      console.error(`Error extracting image: ${err}`);
    })
    .run();
  // });
  return nameOfImages;
};

module.exports = extractImages;
