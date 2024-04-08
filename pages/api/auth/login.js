import User from "../../../server/models/User";
import connectToDB from "../../../server/middleware/db";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            if (!req.body.email || !req.body.password)
                return res.status(400).json({
                    type: "error",
                    message: "Please fill out all fields"
                });

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                let pass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET_KEY);
                let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);
                if (user.email === req.body.email && req.body.password === decryptedPassword) {
                    var token = jwt.sign({
                        data: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }, process.env.JWT_SECRET_KEY, {
                        expiresIn: "2d"
                    });

                    res.status(200).json({
                        type: "success",
                        message: "Authenticated Successfully",
                        token: token,
                        email: user.email
                    });
                } else {
                    res.status(400).json({
                        type: "error",
                        message: "Invalid Credentials"
                    });
                }
            } else {
                res.status(404).json({
                    type: "error",
                    message: "Invalid Credentials"
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
