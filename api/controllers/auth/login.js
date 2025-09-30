import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { oauth2client } from "../../config/googleConfig.js";
import axios from "axios";

export const Login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const googleLoginAndSignup = async(req,res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    const userData = userRes.data;
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      const newUser = await User.create({ email: userData.email, name: userData.name });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
      res.status(200).json({ success: true, token });
    }else{
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
      res.status(200).json({ success: true, token });
    }
  } catch (error) {
    console.error("Error in google login and signup:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}