import mongoose from 'mongoose';
const { Schema } = mongoose;

const PinSchema = new Schema({
    pincode: { type: Number, required: true, unique: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Pin || mongoose.model('Pin', PinSchema);