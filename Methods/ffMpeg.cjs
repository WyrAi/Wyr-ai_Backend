const moment = require("moment");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
// const BufferStream = require("bufferstreams");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

// const OutputDirectory = path.join(__dirname, "../public/ReportImages");
// const parentDirectory = path.join(__dirname, "../public/");
const OutputDirectory = path.join(process.cwd(), "public/ReportImages");
const parentDirectory = path.join(process.cwd(), "public");

const extractImages = async (timestamp, name, inputVideoPath) => {
  // const OutputDirectory =
  //   process.env.OUTPUT_DIRECTORY || "./public/ReportImages";
  // const parentDirectory = process.env.PARENT_DIRECTORY || "./public/";
  let nameOfImages = "";
  // timestamps.forEach((timestamp, index) => {

  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }

  // if (!fs.existsSync(OutputDirectory)) {
  //   fs.mkdirSync(OutputDirectory, { recursive: true });
  // }

  console.log("Current Working Directory:", process.cwd());
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

  // const data = ffmpeg(inputVideoPath)
  //   .seekInput(timestamp)
  //   .frames(1)
  //   .output(outputPath)
  //   .on("end", () => {
  //     console.log(outputPath);
  //     return `${process.env.SERVER_LINK}/Public/ReportImages/${outputFilename}`;
  //   })
  //   .on("error", (err) => {
  //     console.error("Error generating image:", err);
  //   })
  //   .run();
  // ffmpeg(inputVideoPath)
  //   .seekInput(timestamp)
  //   .frames(1)
  //   .output(new BufferStream({ encoding: "binary" }))
  //   .on("end", (stdout, stderr) => {
  //     // 'stdout' now contains the image data as a Buffer
  //     // You can do something with the image data here

  //     // For example, you can save it to a file if needed
  //     fs.writeFileSync(outputPath, stdout);

  //     // Log or process the image data as needed
  //     console.log("Image data:", stdout.length, "bytes");
  //   })
  //   .run();

  // Use a buffer to store the image data

  // ffmpeg(inputVideoPath)
  //   .seekInput(timestamp)
  //   .frames(1)
  //   .toFormat("image2")
  //   .on("end", () => {
  //     // 'stdout' now contains the image data as a Buffer
  //     // You can do something with the image data here

  //     // For example, you can save it to a file if needed
  //     fs.writeFileSync(outputPath, Buffer.concat(capture.data));

  //     // Log or process the image data as needed
  //     console.log("Image data:", Buffer.concat(capture.data).length, "bytes");
  //   })
  //   .capture()
  //   .run();

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputVideoPath)
        .seekInput(timestamp)
        .frames(1)
        .output(outputPath)
        .on("end", () => {
          console.log(`Image ${name} extracted at timestamp ${timestamp}s`);
          nameOfImages = `${process.env.SERVER_LINK}/public/ReportImages/${outputFilename}`;
          resolve();
        })
        .on("error", (err) => {
          console.error(`Error extracting image: ${err}`);
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.error("Exception during image generation:", error);
  }
  // console.log(data, "jhg");

  return nameOfImages;
};

module.exports = extractImages;
