import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join("uploads", "resumes")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
