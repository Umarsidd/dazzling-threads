import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dazzling-threads',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export const uploadToCloudinary = async (fileBuffer, folder = 'dazzling-threads/products') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are configured, upload buffer
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      // Mock / fallback placeholder for local dev without requiring Cloudinary setup
      const mockId = 'dt_' + Date.now();
      resolve({
        url: `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80`,
        publicId: mockId,
      });
    }
  });
};

export default cloudinary;
