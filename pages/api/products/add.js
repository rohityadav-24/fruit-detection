import jwt from "jsonwebtoken";
import Product from "../../../server/models/Product";
import connectToDB from "../../../server/middleware/db";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (data.data.role !== "admin")
                return res.status(403).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            let p = new Product({
                title: req.body.title,
                slug: req.body.slug,
                image: req.body.image,
                price: req.body.price,
                availableQuantity: req.body.availableQuantity
            });
            await p.save();

            res.status(200).json({
                type: "success",
                message: "Products added successfully"
            });
        } catch (err) {
            console.log("[PRODUCT_ADD]", err);
            res.status(500).json({
                type: "error",
                message: "Internal Server Error"
            })
        }
    } else {
        res.status(405).json({
            type: "error",
            message: "Method not allowed"
        });
    }
}

export default connectToDB(handler);
