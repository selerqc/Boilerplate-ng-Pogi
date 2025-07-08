import { v2 as cloudinary } from 'cloudinary';
import config from "./config.js";


cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});
export default cloudinary;



export async function uploadImage(file) {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: 'products',
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
}