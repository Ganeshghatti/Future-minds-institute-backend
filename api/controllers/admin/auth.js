import jwt from "jsonwebtoken";

export const adminLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === "admin@womeninproductindia.com" && password === "admin") {
      const token = jwt.sign({ id: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.json({
        success: true,
        msg: "Admin authenticated successfully",
        token,
      });
    } else {
      res
        .status(401)
        .json({ success: false, msg: "Access denied. Admins only." });
    }
  } catch (error) {
    console.error("Error in adminAuth middleware:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};