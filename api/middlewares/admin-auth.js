import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decodedToken.id;

    if (adminId !== "admin") {
      return res.status(401).json({ message: "Unauthorized. Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default adminAuth;
