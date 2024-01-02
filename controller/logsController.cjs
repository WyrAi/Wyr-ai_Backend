const fs = require("fs");
const moment = require("moment");
const path = require("path");

const logsDirectory = path.join(__dirname, "../public/logs");

// const logsCreate = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log(data);

//     // Ensure the 'logs' directory exists
//     if (!fs.existsSync(logsDirectory)) {
//       fs.mkdirSync(logsDirectory, { recursive: true });
//     }

//     const currentDate = moment(new Date()).format("YYYY-MM-DD_HH-mm-ss");
//     const jsonData = JSON.stringify(data, null, 2);
//     const fileName = `${currentDate} log.json`;
//     const filePath = path.join(logsDirectory, fileName);

//     fs.writeFileSync(filePath, jsonData);
//     res.status(200).json({ message: "file created" });
//   } catch (error) {
//     console.log(error);
//   }
// };

const logsCreate = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    const newJSONData = JSON.stringify(data, null, 2);
    // console.log(newJSONData);

    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory, { recursive: true });
    }

    const fileName = `logs.json`;
    const filePath = path.join(logsDirectory, fileName);

    let existingData = [];

    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(existingContent);
    } else {
      fs.writeFileSync(filePath, "");
    }

    // Add the new data and update date to existingData
    const newData = {
      ...data,
      updateDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    existingData.push(newData);

    // Convert the combined data to JSON
    const jsonData = JSON.stringify(existingData, null, 2);

    // Write the JSON data back to the file
    fs.writeFileSync(filePath, jsonData);
    res.status(200).json({ message: "file created" });
  } catch (error) {
    console.log(error);
  }
};

const getLogFile = async (req, res) => {
  try {
    const filePath = path.join(logsDirectory, "logs.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    return res.download(filePath, "logs.json", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    // return res.status(200).json({ message: "file downloaded" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { logsCreate, getLogFile };
