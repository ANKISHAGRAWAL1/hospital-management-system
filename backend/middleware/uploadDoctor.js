const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================================
// UPLOAD DIRECTORY
// ======================================================

const uploadPath = path.join(__dirname, "../uploads/admins");

// Folder nahi hai to create karo
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ======================================================
// STORAGE
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const filename = `admin-${req.user.id}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed"),
      false
    );
  }
};

// ======================================================
// MULTER CONFIG
// ======================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// ======================================================
// EXPORT
// ======================================================

module.exports = upload;