// import { ImageUploadByFile } from "../Methods/uploadImages.js";
import VideoLink from "../models/VideolinksModel.js";
import { Information } from "../models/information.js";
import { downloadLinkTemplate, mailTransport } from "../utils/mails.js";
import fs from "fs";

const createVideoLink = async (req, res) => {
  try {
    const link = req.body;
    console.log(link);
    const newVideoLink = new VideoLink({ link: link.video_url });
    await newVideoLink.save();
    if (!newVideoLink) {
      res.status(400).json({ message: "link upload failed", status: false });
    }
    res
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
      res.status(200).json({ message: "Video not gernate", status: false });
    }
    res.status(200).json({ message: "Video gernate", status: true, Data });
  } catch (error) {
    console.log(error);
  }
};

const ReportEmailSend = async (req, res) => {
  try {
    const { email } = req.fields;
    const { file } = req.files;

    const fileBuffer = fs.readFileSync(file.path);

    // Convert the buffer to Base64
    const base64Data = fileBuffer.toString("base64");

    // const PDFLink = await ImageUploadByFile(file);

    const link = await VideoLink.find();

    mailTransport().sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Report Share",
      html: downloadLinkTemplate(link[0].link),
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

export { createVideoLink, ReportEmailSend, VideoCheck };
