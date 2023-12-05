import { imageUploadToBase64 } from "../Methods/uploadImages.js";
import { Information } from "../models/information.js";

//Information upload
export const InformationAdd = async (req, res) => {
  try {
    const { image, comment } = req.body;
    console.log(req.body);
    if (!image || !comment) {
      return res.status(400).json({ message: "All details are required" });
    }
    // const imageLink = (await imageUploadToBase64(image)) || " ";
    const response = new Information({
      // image: imageLink,
      image,
      comment,
    });

    await response.save();

    if (response) {
      res.status(200).json({ message: "Information added successfully" });
    }

    // return res.status(400).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};

export const AllInformationGet = async (req, res) => {
  try {
    const Response = await Information.find();
    if (Response) {
      return res.status(200).json({ message: "All Data Send", Response });
    }
    return res.status(400).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};

export const InformationCommentAdd = async (req, res) => {
  try {
    const { id } = req.params;

    const { comment } = req.body;

    if (!id || !comment) {
      return res.status(400).json({ message: "All details are required" });
    } else {
      await Information.findByIdAndUpdate(
        { _id: id },
        {
          $push: {
            comment,
          },
        }
      );

      return res.status(200).json({ message: "Comment added successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const InformationDelete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "All details are required" });
    } else {
      await Information.findByIdAndDelete({ _id: id });
      return res
        .status(200)
        .json({ message: "Information deleted successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};
