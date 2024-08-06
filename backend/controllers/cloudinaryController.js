const sharp = require('sharp');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ ok: false, error: 'No image file provided' });
  }

  try {
    const data = await sharp(file.buffer).resize({ width: 800 }).toBuffer();
    
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ ok: false, error: 'Error uploading image to Cloudinary' });
      }

      res.json({ ok: true, imageUrl: result.secure_url, message: 'Image uploaded successfully' });
    }).end(data);

  } catch (err) {
    console.error('Image processing error:', err);
    return res.status(500).json({ ok: false, error: 'Error processing image' });
  }
};

module.exports = { uploadImage, upload };
