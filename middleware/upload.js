import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 5MB limit for stability
  
 fileFilter : (req, file, cb) => {
    // Optional: Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }

});

export default upload;