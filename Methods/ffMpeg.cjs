const moment = require("moment");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

ffmpeg.setFfmpegPath(ffmpegPath);

const OutputDirectory = path.join(__dirname, "../Public/ReportImages");

const extractImages = async (timestamp,name ,inputVideoPath) => {
  let nameOfImages = "";
  // timestamps.forEach((timestamp, index) => {
    const updateDate = moment(new Date()).format("YYYY-MM-DD_HH-mm-ss");
    const outputFilename = `${updateDate}_${name}.jpg`; // Output image filename
    const outputPath = path.join(OutputDirectory, outputFilename);
    nameOfImages = `http://localhost:5000/Public/ReportImages/${outputFilename}`;
    // Run FFmpeg command to extract image
    ffmpeg(inputVideoPath)
      .seekInput(timestamp)
      .output(outputPath)
      .format("image2") // Specify the output format
      .videoCodec("mjpeg")
      .on("end", () => {
        console.log(`Image ${name} extracted at timestamp ${timestamp}s`);
      })
      .on("error", (err) => {
        console.error(`Error extracting image: ${err}`);
      })
      .run();
  // });
  return nameOfImages;
};

module.exports = extractImages;
