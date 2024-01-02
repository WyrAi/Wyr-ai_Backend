const moment = require("moment");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const OutputDirectory = path.join(__dirname, "../Public/ReportImages");
const parentDirectory = path.join(__dirname, "../Public/");

const extractImages = async (timestamp, name, inputVideoPath) => {
  try {
    let nameOfImages = "";
    // timestamps.forEach((timestamp, index) => {

    if (!fs.existsSync(parentDirectory)) {
      fs.mkdirSync(parentDirectory, { recursive: true });
    }

    if (!fs.existsSync(OutputDirectory)) {
      fs.mkdirSync(OutputDirectory, { recursive: true });
    }

    // console.log("Current Working Directory:", process.cwd());
    console.log("Parent Directory:", parentDirectory);
    console.log("Report Images Directory:", OutputDirectory);
    const updateDate = moment(new Date()).format("YYYY-MM-DD_HH-mm-ss");
    const outputFilename = `${updateDate}_${name}.jpg`; // Output image filename
    const outputPath = path
      .join(OutputDirectory, outputFilename)
      .replace(/\\/g, "/");

    // Run FFmpeg command to extract image
    // ffmpeg(inputVideoPath)
    //   .seekInput(timestamp)
    //   .output(outputPath)
    //   .format(outputPath) // Specify the output format
    //   // .videoCodec("mjpeg")
    //   // .outputOptions([
    //   //   "-q:v 2", // Adjust the quality (lower is better)
    //   // ])
    //   .on("end", () => {
    //     console.log(`Image ${name} extracted at timestamp ${timestamp}s`);
    //     nameOfImages = `${process.env.SERVER_LINK}/Public/ReportImages/${outputFilename}`;
    //   })
    //   .on("error", (err) => {
    //     console.error(`Error extracting image: ${err}`);
    //   })
    //   .run();

    // // Run FFmpeg command to extract image
    // ffmpeg(inputVideoPath)
    //   .seekInput(timestamp)
    //   .output(outputPath)
    //   // .format("jpg") // Specify the output format
    //   .videoCodec("mjpeg")
    //   .on("end", () => {
    //     console.log(`Image ${name} extracted at timestamp ${timestamp}s`);
    //     nameOfImages = `${process.env.SERVER_LINK}/Public/ReportImages/${outputFilename}`;
    //   })
    //   .on("error", (err) => {
    //     console.error(`Error extracting image: ${err}`);
    //   })
    //   .run();

    // });

    ffmpeg(inputVideoPath)
      .seekInput(timestamp)
      .frames(1)
      .output(outputPath)
      .on("end", () => {
        console.log(outputPath);
        nameOfImages = `${process.env.SERVER_LINK}/Public/ReportImages/${outputFilename}`;
      })
      .run();

    return nameOfImages;
  } catch (error) {
    console.log(error);
  }
};

module.exports = extractImages;
