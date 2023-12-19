import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "dobbygr2i",
  api_key: "853536877481681",
  api_secret: "fyAo5AewC_kg4Nu6zyeD0Q2oX4c",
});

const imageUpload = async (images) => {
  try {
    console.log(images);
    if (!images.length) {
      const ImageUploadLink = await cloudinary.uploader.upload(images.path);
      return ImageUploadLink.url;
    } else {
      const multipleImages = [];
      for (let i = 0; i < images.length; i++) {
        await cloudinary.uploader
          .upload(images[i].path)
          .then((link) => {
            multipleImages.push(link.url);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return multipleImages;
    }
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};

const imageUploadToBase64 = async (images) => {
  try {
    if (typeof images == "string") {
      const ImageUploadLink = await cloudinary.uploader.upload(images, {
        resource_type: "auto",
      });
      return ImageUploadLink.url;
    } else {
      const multipleImages = [];
      for (let i = 0; i < images.length; i++) {
        await cloudinary.uploader
          .upload(images[i], { resource_type: "auto" })
          .then((link) => {
            multipleImages.push(link.url);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return multipleImages;
    }
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};

const imageuploadImageDelete = async (image) => {
  try {
    const imagelink = image.split("/");
    const imagename = imagelink[imagelink.length - 1].split(".")[0];
    if (image) {
      await cloudinary.uploader.destroy(imagename, (err, result) => {
        if (result.result == "not found") {
          console.log("image not found");
        }
        if (err) console.log("image not Upoload", err);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export { imageUpload, imageUploadToBase64, imageuploadImageDelete };
