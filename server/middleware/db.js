import mongoose from "mongoose";

const connectToDB = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    // const connect = await mongoose.connect(process.env.MONGO_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useCreateIndex: true,
    //     useFindAndModify: false
    // });
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    return handler(req, res);
};

export default connectToDB;
