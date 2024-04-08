import jwt from "jsonwebtoken";
import Product from "../../../server/models/Product";
import connectToDB from "../../../server/middleware/db";

const handler = async (req, res) => {
    if (req.method === "PUT") {
        try {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (data.data.role !== "admin")
                return res.status(403).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            let prod = await Product.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true });
            res.status(200).json({
                type: "success",
                message: "Product updated successfully",
                data: prod
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Internal Server Error"
            });
        }
    } else {
        res.status(405).json({
            type: "error",
            message: "Method not allowed"
        });
    }
}

export default connectToDB(handler);
