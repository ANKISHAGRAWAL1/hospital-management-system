const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    // Admin profile image
    if (file.fieldname === "profileImage") {
      folder = "admins";
    }

    // Doctor profile image
    else if (file.fieldname === "profile") {
      folder = "doctors";
    }

    // Invalid field
    else {
      return cb(
        new Error("Invalid upload field name"),
        false
      );
    }

    const uploadPath = path.join(
      __dirname,
      `../uploads/${folder}`
    );

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, {
        recursive: true,
      });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    let prefix;

    // Admin
    if (file.fieldname === "profileImage") {
      prefix = "admin";
    }

    // Doctor
    else if (file.fieldname === "profile") {
      prefix = "doctor";
    }

    else {
      return cb(
        new Error("Invalid upload field name"),
        false
      );
    }

    const userId = req.user?.id || "user";

    const filename = `${prefix}-${userId}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});


// Allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }

  cb(null, true);
};


// Multer configuration
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;