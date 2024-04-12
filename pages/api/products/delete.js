import jwt from "jsonwebtoken";
import Product from "../../../server/models/Product";
import connectToDB from "../../../server/middleware/db";

const handler = async (req, res) => {
    if (req.method === "DELETE") {
        try {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (data.data.role === "admin") {
                await Product.findByIdAndDelete(req.body.id);
            } else if (data.data.role === "seller") {
                await Product.findOneAndDelete({ _id: req.body.id, seller_id: data.data.id });
            } else {
                return res.status(403).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });
            }
            
            res.status(200).json({
                type: "success",
                message: "Products deleted successfully"
            });
        } catch (err) {
            console.log("[PRODUCT_DELETE]", err);
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
