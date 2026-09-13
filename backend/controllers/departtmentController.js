const Department = require("../models/Departments");

// =====================================================
// CREATE DEPARTMENT
// =====================================================
const { uniquename } = require("../utils/helper");

const createDepartment = async (req, res) => {
  try {
    // Image required
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Department image is required",
      });
    }

    const image = req.files.image;

    const {
      name,
      code,
      description,
      location,
      headDoctor,
    } = req.body;

    // Required validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    // Clean data
    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();
    const cleanDescription = description?.trim() || "";
    const cleanLocation = location?.trim() || "";
    const cleanHeadDoctor = headDoctor?.trim() || "";

    // Duplicate check
    const existingDepartment = await Department.findOne({
      $or: [
        { name: cleanName },
        { code: cleanCode },
      ],
    });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "Department with this name or code already exists",
      });
    }

    // Unique image name
    const imageName = uniquename(image.name);

    // Upload image
    const destination = `public/Departments/${imageName}`;

    await image.mv(destination);

    // Save department
    const department = await Department.create({
      name: cleanName,
      code: cleanCode,
      description: cleanDescription,
      location: cleanLocation,
      headDoctor: cleanHeadDoctor,
      image: imageName,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });

  } catch (error) {
    console.log("CREATE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createDepartment,
};

// =====================================================
// GET ALL DEPARTMENTS
// =====================================================
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });

  } catch (error) {
    console.error("❌ GET ALL DEPARTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// GET SINGLE DEPARTMENT
// =====================================================
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });

  } catch (error) {
    console.error("❌ GET DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// UPDATE DEPARTMENT
// =====================================================
const fs = require("fs");
const path = require("path");

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("========================================");
    console.log("🔥 UPDATE DEPARTMENT API HIT");
    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("========================================");

    // ==========================================
    // FIND DEPARTMENT
    // ==========================================

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // ==========================================
    // GET BODY
    // ==========================================

    const {
      name,
      code,
      description,
      location,
      headDoctor,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    // ==========================================
    // CLEAN DATA
    // ==========================================

    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();
    const cleanDescription =
      description?.trim() || "";
    const cleanLocation =
      location?.trim() || "";
    const cleanHeadDoctor =
      headDoctor?.trim() || "";

    // ==========================================
    // CHECK DUPLICATE NAME / CODE
    // ==========================================

    const existingDepartment =
      await Department.findOne({
        $or: [
          { name: cleanName },
          { code: cleanCode },
        ],
        _id: { $ne: id },
      });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message:
          "Another department with this name or code already exists",
      });
    }

    // ==========================================
    // UPDATE BASIC DATA
    // ==========================================

    department.name = cleanName;
    department.code = cleanCode;
    department.description = cleanDescription;
    department.location = cleanLocation;
    department.headDoctor = cleanHeadDoctor;

    // ==========================================
    // IMAGE UPDATE
    // ==========================================

    if (req.files && req.files.image) {
      const image = req.files.image;

      // ------------------------------------------
      // IMAGE TYPE
      // ------------------------------------------

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Only JPG, JPEG, PNG and WEBP images are allowed",
        });
      }

      // ------------------------------------------
      // IMAGE SIZE - 2MB
      // ------------------------------------------

      const maxSize = 2 * 1024 * 1024;

      if (image.size > maxSize) {
        return res.status(400).json({
          success: false,
          message:
            "Image size must be less than 2MB",
        });
      }

      // ------------------------------------------
      // UNIQUE IMAGE NAME
      // ------------------------------------------

      const imageName = uniquename(image.name);

      // ------------------------------------------
      // IMAGE DIRECTORY
      // ------------------------------------------

      const uploadDir = path.join(
        __dirname,
        "../public/departments"
      );

      // ------------------------------------------
      // CREATE DIRECTORY IF NOT EXISTS
      // ------------------------------------------

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
          recursive: true,
        });
      }

      // ------------------------------------------
      // NEW IMAGE PATH
      // ------------------------------------------

      const newImagePath = path.join(
        uploadDir,
        imageName
      );

      // ------------------------------------------
      // DELETE OLD IMAGE
      // ------------------------------------------

      if (department.image) {
        const oldImagePath = path.join(
          uploadDir,
          department.image
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);

          console.log(
            "🗑️ OLD IMAGE DELETED:",
            department.image
          );
        }
      }

      // ------------------------------------------
      // SAVE NEW IMAGE
      // ------------------------------------------

      await image.mv(newImagePath);

      console.log(
        "✅ NEW IMAGE SAVED:",
        imageName
      );

      department.image = imageName;
    }

    // ==========================================
    // SAVE DEPARTMENT
    // ==========================================

    await department.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message:
        "Department updated successfully",
      data: department,
    });

  } catch (error) {
    console.error(
      "❌ UPDATE DEPARTMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};


// =====================================================
// UPDATE DEPARTMENT STATUS
// =====================================================
const updateDepartmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Status must be true or false",
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Department status ${
        status ? "activated" : "deactivated"
      } successfully`,
      data: department,
    });

  } catch (error) {
    console.error("❌ UPDATE DEPARTMENT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// DELETE DEPARTMENT
// =====================================================
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await department.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });

  } catch (error) {
    console.error("❌ DELETE DEPARTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================
module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
  deleteDepartment,
};