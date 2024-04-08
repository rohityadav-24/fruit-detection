import Order from "../../../server/models/Order";
import Product from "../../../server/models/Product";
import connectToDB from "../../../server/middleware/db";
const crypto = require("crypto");

const handler = async (req, res) => {
    try {
        if (req.method !== "POST")
            return res.status(405).json({
                type: "error",
                message: "Method not allowed"
            });

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        let body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        let order;
        let authenticated = expectedSignature === razorpay_signature;
        if (!authenticated) {
            order = await Order.findOneAndUpdate({ paymentId: req.body.razorpay_order_id }, {
                paymentInfo: req.body,
                paymentStatus: "Pending",
                transactionId: req.body.razorpay_payment_id
            }, { new: true });

            return res.status(200).json({
                type: "error",
                message: "Payment not completed"
            });
        } else {
            order = await Order.findOneAndUpdate({ paymentId: req.body.razorpay_order_id }, {
                paymentInfo: req.body,
                paymentStatus: "Completed",
                transactionId: razorpay_payment_id
            }, { new: true });

            let products = order.products;
            for (let slug in products) {
                let qty;
                let product = await Product.findOne({ slug: slug });
                if (product.availableQuantity <= 0)
                    qty = 0
                else
                    qty = product.availableQuantity - products[slug].qty

                await Product.findOneAndUpdate({ slug }, { availableQuantity: qty });
            }

            return res.status(200).json({
                type: "success",
                message: "Payment completed successfully",
                clearCart: true,
                data: order.id
            });
        }

    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Internal server error"
        });
    }
}

export default connectToDB(handler);