import mongoose from 'mongoose';
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: Number, unique: true, required: true },
    address: { type: String },
    city: { type: String },
    pincode: { type: Number },
    role: { type: String, default: "user" },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: uuidv4() },
    resetToken: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);