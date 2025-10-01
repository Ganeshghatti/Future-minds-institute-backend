import category from "../../models/category.js";

export const getCategories = async (req, res) => {
  try {
    console.log("Fetching all categories...");
    const categories = await category.find();
    console.log(`Found ${categories.length} categories:`, categories);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Check existing categories before creating
    const existingCategories = await category.find();
    console.log(`Existing categories before creation: ${existingCategories.length}`);
    
    const newCategory = new category({ name, description });
    await newCategory.save();
    
    // Check categories after creation
    const allCategories = await category.find();
    console.log(`Total categories after creation: ${allCategories.length}`);
    console.log("All categories:", allCategories);
    
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }
    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
