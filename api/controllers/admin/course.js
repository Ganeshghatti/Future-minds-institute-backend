import Course from "../../models/course.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const createCourse = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.features ||
      !req.body.price ||
      !req.body.duration ||
      !req.body.discountPrice ||
      !req.body.earlyBirdTitle ||
      !req.body.courseTotalDuration
    ) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    const features = Array.isArray(req.body.features)
      ? req.body.features
      : String(req.body.features)
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean);

    // Handle categories as array of ObjectIds
    let categories = req.body.categories;
    if (!categories) {
      categories = [];
    } else if (!Array.isArray(categories)) {
      categories = String(categories)
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean);
    }

    const {
      name,
      description,
      price,
      isActive,
      duration,
      discountPrice,
      earlyBirdTitle,
      courseTotalDuration,
    } = req.body;
    const course = await Course.create({
      name,
      description,
      features,
      price,
      isActive,
      duration,
      discountPrice,
      earlyBirdTitle,
      courseTotalDuration,
      categories,
    });
    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      name,
      description,
      features,
      price,
      isActive,
      duration,
      discountPrice,
      earlyBirdTitle,
      courseTotalDuration,
      categories,
    } = req.body;

    if (features && !Array.isArray(features)) {
      features = String(features)
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);
    }

    if (categories && !Array.isArray(categories)) {
      categories = String(categories)
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean);
    }

    const course = await Course.findByIdAndUpdate(
      id,
      {
        name,
        description,
        features,
        price,
        isActive,
        duration,
        discountPrice,
        earlyBirdTitle,
        courseTotalDuration,
        categories,
      },
      { new: true }
    );
    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ success: true, msg: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
