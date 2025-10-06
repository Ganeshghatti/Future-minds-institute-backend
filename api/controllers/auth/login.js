import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { oauth2client } from "../../config/googleConfig.js";
import axios from "axios";
import sendResetPasswordLink from "../../utils/email.js";

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

export const SendResetPasswordLink = async(req,res) => {
  try{
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Provide credentials first.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exist, please register first.",
      });
    }
    
    const resetToken = jwt.sign(
      {id: user._id, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn: "5m"}
    )

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailResponse = await sendResetPasswordLink(email, resetUrl);
    if(!emailResponse) {
      return res.status(400).json({
        success: false,
        message: "Failed to send reset password link. Please try again later.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Reset password link sent successfully. Check your email.",
    });
  } catch (error) {
    console.error("Error in SendResetPasswordLink:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export const verifyResetPasswordLink = async(req,res) => {
  try{
    const { resetToken } = req.query;
    if(!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }

    const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
    if(!decodedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }
    const user = await User.findById(decodedToken.id).select("-password");
    if(!user || user.email !== decodedToken.email) {
      return res.status(400).json({
        success: false,
        message: "User not found or email doesn't match.",
      });
    }
    if(user.resetTokenExpire!=null && Date.now() > user.resetTokenExpire) {
      if(user.resetToken!=null) {
        user.resetToken = null;
        user.resetTokenExpire = null;
        await user.save();
      }
      return res.status(400).json({
        success: false,
        message: "Reset token expired.",
      });
    }

    if(user.lastResetPasswordAt!=null && Date.now() - user.lastResetPasswordAt < 1 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "You can only change your password once every hour."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset token verified successfully.",
      user,
    });
  } catch(error){
    console.error("Error in verifyResetPasswordLink:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

export const changePassword = async(req,res) => {
  try{
    const { resetToken, password } = req.body;
    if(!resetToken || !password) {
      return res.status(400).json({
        success: false,
        message: "Credentials are not found.",
      });
    }

    const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
    if(!decodedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }
    
    const user = await User.findById(decodedToken.id).select("-password");
    if(!user || user.email !== decodedToken.email) {
      return res.status(400).json({
        success: false,
        message: "User not found or email doesn't match.",
      });
    }
    if(user.resetTokenExpire!=null && Date.now() > user.resetTokenExpire) {
      if(user.resetToken!=null) {
        user.resetToken = null;
        user.resetTokenExpire = null;
        await user.save();
      }
      return res.status(400).json({
        success: false,
        message: "Reset token expired."
      });
    }

    if(user.lastResetPasswordAt!=null && Date.now() - user.lastResetPasswordAt < 1 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "You can only change your password once every hour."
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;
    user.lastResetPasswordAt = Date.now();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully, please login with new password.",
    });
  } catch(error){
    console.error("Error in changePassword:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}