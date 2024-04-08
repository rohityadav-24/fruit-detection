import mongoose from "mongoose";

const connectToDB = handler => async (req, res) => {
    try {
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        mongoose.set('strictQuery', false);
        mongoose.connect(process.env.MONGO_URI).then((data) => {
            console.log(`MongoDB Connected: ${data.connection.host}`);
        }).catch((err) => {
            console.log(err);
        });

        return handler(req, res);
    } catch (err) {
        console.log(err);
    }
};

export default connectToDB;
