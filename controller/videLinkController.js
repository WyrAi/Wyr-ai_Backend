// import { ImageUploadByFile } from "../Methods/uploadImages.js";
import VideoLink from "../models/VideolinksModel.js";
import { Information } from "../models/information.js";
import { downloadLinkTemplate, mailTransport } from "../utils/mails.js";
import fs from "fs";

const createVideoLink = async (req, res) => {
  try {
    const link = req.body;
    console.log(link);
    // const newVideoLink = "";
    // if (link.video_url) {
    const newVideoLink = new VideoLink({ link: link.video_url });
    // } else {
    //   newVideoLink = new VideoLink({ link: link.command });
    // }
    await newVideoLink.save();
    if (!newVideoLink) {
      return res
        .status(400)
        .json({ message: "link upload failed", status: false });
    }
    return res
      .status(201)
      .json({ message: "link upload", status: true, newVideoLink });
  } catch (error) {
    console.log(error);
  }
};

const VideoCheck = async (req, res) => {
  try {
    const Data = await VideoLink.find();
    if (Data.length === 0) {
      return res
        .status(200)
        .json({ message: "Video not gernate", status: false });
    }
    return res
      .status(200)
      .json({ message: "Video gernate", status: true, Data });
  } catch (error) {
    console.log(error);
  }
};

const CreateDataSet = async (req, res) => {
  try {
    const Data = await VideoLink.find();
    if (Data.length > 0) {
      for (let i = 0; i < Data.length; i++) {
        let checkType = Data[i].link.split("/");
        let checkType1 = checkType[checkType.length - 1].includes(".png");
        if (checkType1) {
          const Report = Information({
            image: Data[i].link,
          });
          await VideoLink.deleteOne({ _id: Data[i]._id });
          for (let j = i + 1; j < Data.length; j++) {
            let commentType = Data[j].link.split("/");
            let commentType1 =
              commentType[commentType.length - 1].includes(".png");
            let videoType =
              commentType[commentType.length - 1].includes(".mkv");
            if (!commentType1 && !videoType) {
              console.log("image");
              Report.comment.push(Data[j].link);
              await VideoLink.deleteOne({ _id: Data[j]._id });
            } else {
              await Report.save();
              // await VideoLink.deleteOne({ _id: Data[j]._id });
              break;
            }
          }
        }
      }
      return res
        .status(200)
        .json({ message: "Data set created", status: true });
    } else {
      const response = await Information.find();
      if (response.length > 0) {
        return res
          .status(200)
          .json({ message: "Data set created", status: true });
      }
    }
    return res
      .status(200)
      .json({ message: "Data set not created", status: false });
  } catch (error) {
    console.log(error);
  }
};
// CreateDataSet();
const ReportEmailSend = async (req, res) => {
  try {
    const { email } = req.fields;
    const { file } = req.files;

    const fileBuffer = fs.readFileSync(file.path);

    // Convert the buffer to Base64
    const base64Data = fileBuffer.toString("base64");

    // const PDFLink = await ImageUploadByFile(file);

    const link = await VideoLink.find();
    const updateLink = link[0].link.replace(".mkv", ".mp4");
    mailTransport().sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Report Share",
      html: downloadLinkTemplate(updateLink),
      attachments: [
        {
          filename: "file.pdf",
          content: base64Data,
          encoding: "base64",
        },
      ],
    });
    // fileStream.close();
    res.status(200).json({ message: "Email sent successfully", status: true });

    await VideoLink.deleteMany();
    await Information.deleteMany();
  } catch (error) {
    console.log(error);
  }
};

export { createVideoLink, ReportEmailSend, VideoCheck, CreateDataSet };
