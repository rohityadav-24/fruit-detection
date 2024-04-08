const https = require('https');
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import Order from "../../../server/models/Order";
import Product from "../../../server/models/Product";
import connectToDB from "../../../server/middleware/db";
import pincodes from "../../../Components/assets/pincodes.json";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (req.body.subTotal <= 0)
                return res.status(200).json({
                    type: "error",
                    cartClear: true,
                    message: "Please add some items!"
                })

            // check if the cart is tampered
            let product, sumTotal = 0;
            for (let item in req.body.cart) {
                sumTotal += req.body.cart[item].price * req.body.cart[item].qty;
                product = await Product.find({ slug: item });
                if (product[0].availableQuantity < req.body.cart[item].qty)
                    return res.status(200).json({
                        type: "error",
                        cartClear: true,
                        message: "Some items are out of stock!"
                    })

                if (product[0].price != req.body.cart[item].price)
                    return res.status(200).json({
                        type: "error",
                        cartClear: true,
                        message: "Price of some items have changed!"
                    })
            }
            if ((sumTotal !== req.body.subTotal) || req.body.subTotal === 0)
                return res.status(200).json({
                    type: "error",
                    cartClear: true,
                    message: "Price of some items have changed!"
                })

            if (!/^[6-9]\d{9}$/.test(req.body.mobile))
                return res.status(200).json({
                    type: "error",
                    cartClear: false,
                    message: "Invalid phone number!"
                })

            if (req.body.pincode.length !== 6 || !Number.isInteger(Number(req.body.pincode)))
                return res.status(200).json({
                    type: "error",
                    cartClear: false,
                    message: "Invalid pincode!"
                })

            if (!Object.keys(pincodes).includes(req.body.pincode))
                return res.status(200).json({
                    type: "error",
                    cartClear: false,
                    message: "Sorry! Area is not deliverable!"
                })

            let order = new Order({
                name: req.body.name,
                user_id: data.data.id,
                email: req.body.email,
                mobile: req.body.mobile,
                orderId: req.body.ordID,
                products: req.body.cart,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                amount: req.body.subTotal
            });
            await order.save();

            const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

            const newOrder = await instance.orders.create({
                amount: req.body.subTotal * 100,
                currency: "INR"
            });

            order = await Order.findOneAndUpdate({ _id: order.id }, { paymentId: newOrder.id }, { new: true });

            return res.status(200).json({
                type: "success",
                cartClear: false,
                message: "Order Initiated Successfully",
                data: order,
                key: process.env.RAZORPAY_KEY_ID
            });

        } catch (err) {
            console.log("[PRE_PAYMENT]", err);
            res.status(500).json({
                type: "error",
                cartClear: false,
                message: "Internal Server Error"
            });
        }
    } else {
        res.status(405).json({
            type: "error",
            cartClear: false,
            message: "Method not allowed"
        });
    }
}

export default connectToDB(handler);