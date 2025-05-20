import multer from "multer";
import path from "path";

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${timestamp}${ext}`);
  },
});

// Validate file types: images and videos only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const isExtValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeValid = allowedTypes.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    console.warn(`Blocked file: ${file.originalname} - ${file.mimetype}`);
    cb(new Error("Only images and videos are allowed!"));
  }
};

// Multer config
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});
