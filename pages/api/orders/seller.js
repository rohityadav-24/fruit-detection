import Order from "../../../server/models/Order";
import connectToDB from "../../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method !== "POST")
            return res.status(400).json({
                type: "error",
                message: "Method not allowed"
            });

        const token = req.body.token;
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (data.data.role !== "seller")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action"
            });

        let orders;
        if (req.body.type === "all") {
            orders = await Order.find();
            let prods = [];

            orders.forEach((order) => {
                Object.keys(order.products).map((item) => {
                    if (order.products[item].seller_id === data.data.id) {
                        prods.push(order);
                    }
                });
            });

            orders = prods;
        }

        else if (req.body.type === "single")
            orders = await Order.findOne({ _id: req.body.id });

        else if (req.body.type === "update") {
            orders = await Order.findOneAndUpdate({ _id: req.body.id }, {
                orderStatus: req.body.orderStatus,
                paymentStatus: req.body.paymentStatus,
                trackURL: req.body.trackURL
            }, { new: true });

            return res.status(200).json({
                type: "success",
                message: "Updated Successfully"
            });

        } else if (req.body.type === "delete") {
            orders = await Order.findOneAndDelete({ _id: req.body.id });
            if (!orders)
                return res.status(404).json({
                    type: "error",
                    message: "Order not found"
                });

            return res.status(200).json({
                type: "success",
                message: "Deleted Successfully"
            });

        } else if (req.body.type === "deleteAll") {
            orders = await Order.deleteMany({ _id: { $in: req.body.ids }, user_id: data.data.id });
            if (!orders)
                return res.status(404).json({
                    type: "error",
                    message: "Order not found"
                });

            return res.status(200).json({
                type: "success",
                message: "Deleted Successfully"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Fetched Successfully",
            data: orders
        });
    } catch (err) {
        console.log("[SELLER_ORDER]", err);
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);