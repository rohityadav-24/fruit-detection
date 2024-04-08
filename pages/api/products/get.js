import Product from "../../../server/models/Product";
import connectToDB from "../../../server/middleware/db";

const handler = async (req, res) => {
    try {
        let products;
        if (req.body.query)
            products = await Product.find(req.body.query);
        else
            products = await Product.find();
        res.status(200).json({
            type: "success",
            message: "Products fetched successfully",
            data: products
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);
