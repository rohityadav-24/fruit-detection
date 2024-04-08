import Order from "../../../server/models/Order";
import connectToDB from "../../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        const token = req.body.token;
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

        let orders;
        if (req.body.type === "all")
            orders = await Order.find({ user_id: data.data.id });
        else if (req.body.type === "single")
            orders = await Order.findOne({ _id: req.body.id, user_id: data.data.id });

        res.status(200).json({
            type: "success",
            message: "Fetched Successfully",
            data: orders
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);