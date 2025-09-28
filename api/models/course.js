import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    courseTotalDuration: { type: Number, required: true },
    features: { type: [String], required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    earlyBirdTitle: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Course", CourseSchema);
