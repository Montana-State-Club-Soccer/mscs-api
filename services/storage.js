const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const isConfigured = () => !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

// Upload an image buffer to Cloudinary
// Returns { url } or throws
const uploadBuffer = (buffer, originalName) => {
  if (!isConfigured()) {
    throw new Error('Cloudinary credentials missing. Set CLOUDINARY_* env vars.');
  }
  return new Promise((resolve, reject) => {
    const folder = process.env.CLOUDINARY_FOLDER || 'roster';
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: 'image',
        public_id: undefined,
        filename_override: originalName
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url });
      }
    );
    stream.end(buffer);
  });
};

module.exports = { uploadBuffer, isConfigured };
