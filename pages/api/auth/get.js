import User from "../../../server/models/User";
import connectToDB from "../../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
            let user = await User.findOne({ email: data.data.email });
            if (user) {
                res.status(200).json({
                    type: "success",
                    message: "User Details Fetched",
                    data: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        address: user.address,
                        city: user.city,
                        pincode: user.pincode,
                        role: user.role,
                    }
                });
            } else {
                res.status(400).json({
                    type: "error",
                    message: "No user found"
                });
            }

        } else {
            res.status(405).json({
                type: "error",
                message: "Method not allowed"
            });
        }
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);
