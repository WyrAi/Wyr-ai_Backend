import ReportTime from "../models/ReportsTiModule.js";
import VideoLink from "../models/VideolinksModel.js";
import extractImages from "../Methods/ffMpeg.cjs";
import fs from "fs";
import { Information } from "../models/information.js";
import moment from "moment";

export const ReportTimeCreate = async (req, res) => {
  try {
    const { Name, Time, Comment } = req.body;
    console.log(req.body);

    if (!Name) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const reportTime = new ReportTime({
      Name,
      Time: Time || new Date(),
      Comment: Comment || "",
    });

    reportTime.save();

    return res.status(200).json({ msg: "Report Time Created" });
  } catch (error) {
    console.log(error);
  }
};

export const ReportImageCreate = async (req, res) => {
  try {
    const videoLink = await VideoLink.find();
    if (!videoLink[0])
      return res.status(400).json({ msg: "Video link not found" });

    const TimeDatas = await ReportTime.find();
    if (!TimeDatas.length < 0)
      return res.status(400).json({ msg: "Image not found" });
    if (videoLink[0] && TimeDatas.length > 0) {
      let VideoTime = TimeDatas.filter((val) => val.Name === "Video").map(
        (val) => val.Time
      );
      VideoTime = moment(VideoTime[0].split(" ")[4], "HH:mm:ss");
      const ImagesTime = TimeDatas.filter(
        (val) => val.Name.includes("Image") && !val.Comment
      );
      // console.log(ImagesTime);
      for (let i = 0; i < ImagesTime.length; i++) {
        const ImageTimeGet = moment(
          ImagesTime[i].Time.split(" ")[4],
          "HH:mm:ss"
        );
        const duration = moment.duration(ImageTimeGet.diff(VideoTime));
        const formattedDuration = moment
          .utc(duration.asMilliseconds())
          .format("HH:mm:ss");
        const Comment = TimeDatas.filter(
          (val) => val.Name == ImagesTime[i].Name && val.Comment
        ).map((val) => val.Comment);
        // console.log(Comment);
        // console.log(`Time difference: ${formattedDuration}`);
        const ImagesName = await extractImages(
          formattedDuration,
          ImagesTime[i].Name,
          videoLink[0].link
        );
        // console.log(ImagesName);
        // if (ImagesName) {
        await Information.create({ image: ImagesName, comment: Comment });
        // }
      }
      // const times = timeStamps.map((item) => item.Time);
      // console.log(times);

      res.status(200).json({ msg: "Images extracted" });
      // console.log(ImagesName);
    } else {
      res
        .status(400)
        .json({ msg: "Something went wrong", videoLink, timeStamps });
    }
  } catch (error) {
    console.log(error);
  }
};

// export const imageRemove = async (req, res) => {
//   try {
//     const data = await Information.find();
//     const imagesAddress = data.map((val) => val.image);
//     console.log(typeof imagesAddress[0].split(":5000")[1]);

//     for (let i = 0; i < imagesAddress.length; i++) {
//       fs.unlinkSync(imagesAddress[i].split(":5000")[1]);
//     }

//     res.status(200).json({ msg: "Images removed" });
//   } catch (error) {
//     console.log(error);
//   }
// };
