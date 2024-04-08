import User from "../../../../server/models/User";
import connectToDB from "../../../../server/middleware/db";
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const { name, email, password, mobile } = req.body;

            if (!name || !email || !password || !mobile)
                return res.status(400).json({
                    type: "error",
                    message: "Please fill out all fields"
                });

            if (password.length < 8)
                return res.status(400).json({
                    type: "error",
                    message: "Password must be at least 8 characters long"
                });

            if (mobile.length != 10)
                return res.status(400).json({
                    type: "error",
                    message: "Invalid Mobile Number"
                });

            if (req.body.pincode && req.body.pincode.length != 6)
                return res.status(400).json({
                    type: "error",
                    message: "Invalid Pincode"
                });

            const allowedDomains = ["gmail.com", "yahoo.com", "rediffmail.com", "outlook.com"];
            if (!allowedDomains.includes(email.split("@")[1]))
                return res.status(400).json({
                    type: "error",
                    message: "Please use a valid email address"
                });

            let u = await User.findOne({ email });
            if (u)
                return res.status(400).json({
                    type: "error",
                    message: "Email already exists"
                });

            u = await User.findOne({ mobile });
            if (u)
                return res.status(400).json({
                    type: "error",
                    message: "Mobile number already exists"
                });

            let user = new User({
                name,
                email,
                password: CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString(),
                mobile,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                role: req.body.role,
                verified: true
            });
            await user.save();

            res.status(200).json({
                type: "success",
                message: "Account created successfully."
            });

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
