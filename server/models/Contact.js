import mongoose from 'mongoose';
const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    reply: { type: String, },
    status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);