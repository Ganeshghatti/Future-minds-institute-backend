import category from "../../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};