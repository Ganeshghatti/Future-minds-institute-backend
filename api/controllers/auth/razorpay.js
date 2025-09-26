import User from "../../models/user.js";
import Course from "../../models/course.js";
import razorpayConfig from "../../config/razorpayConfig.js";
import crypto from "crypto";

export const subscribeUser = async (req, res) => {
    try {

      console.log("Request body: ", req.body);
      console.log("Request params: ", req.params);
      console.log("Request user: ", req.user);

      if(!req.body){
        res.status(400).json({
          success: false,
          message: "Missing required fields: JSON data is required",
        });
        return;
      }

      // if (!req.body.data) {
      //   res.status(400).json({
      //     success: false,
      //     message:
      //       "Missing required fields: JSON data is required",
      //   });
      //   return;
      // }
  
      // let formData;
      // try {
      //   formData = JSON.parse(req.body.data);
      // } catch (error) {
      //   res.status(400).json({
      //     success: false,
      //     message: "Invalid JSON data format",
      //   });
      //   return;
      // }
  
      const courseId = req.body.courseId;
      const { userId } = req.params;

      // console.log("courseId: ", courseId);
      // console.log("userId: ", userId);
  
      if (!userId || !courseId) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: userId, courseId",
        });
        return;
      }
  
      // Find user
      const user = await User.findById(userId);
  
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
  
      console.log("user on subscribe: ", user);
  
      // Find course
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({
          success: false,
          message: "Course not found",
        });
        return;
      }
  
      if (!course.isActive) {
        res.status(400).json({
          success: false,
          message: "Course is not active",
        });
        return;
      }
  
      console.log("course active:", course);
  
      // convert to amount to integer
      const options = {
        amount: Math.round(course.discountPrice * 100),
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
      };
  
      const order = await razorpayConfig.orders.create(options);
  
      console.log("order created: ", order);
  
      res.status(200).json({
        success: true,
        message: "Course subscription initiated successfully",
        data: {
          order,
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
            countryCode: "+91",
          },
        },
      });
    } catch (error) {
      console.error("Error in subscribing user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to subscribe user",
        error: error,
      });
    }
  };
  
  export const verifyPaymentSubscription = async ( req, res ) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        courseId,
      } = req.body;
  
      const userId = req.user._id;
      console.log("userId: ", userId);
  
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courseId ||
        !userId
      ) {
        res.status(400).json({
          success: false,
          message:
            "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId",
        });
        return;
      }
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZ_KEY_SECRET || "")
        .update(sign.toString())
        .digest("hex");
      if (razorpay_signature === expectedSign) {
        // Payment is verified
        const user = await User.findById(userId);

        if (!user) {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
          return;
        }
  
        const course = await Course.findById(courseId);
        if (!course) {
          res.status(404).json({
            success: false,
            message: "Course not found",
          });
          return;
        }
  
        if (!course.isActive) {
          res.status(400).json({
            success: false,
            message: "Course is not active",
          });
          return;
        }
  
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + parseInt(course.duration));
  
        const newSubscribedCourse = {
          startDate: new Date(),
          endDate,
          razorpay_order_id,
          razorpay_payment_id,
          courseId: course._id,
          price: course.price,
        };
  
        user.courses.push(newSubscribedCourse);
  
        await user.save();
  
        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          data: doctor,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };