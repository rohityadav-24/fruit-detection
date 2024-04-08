import User from "../../../server/models/User";
import connectToDB from "../../../server/middleware/db";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (req.body.newPassword !== req.body.confirmNewPassword)
                return res.status(400).json({
                    type: "error",
                    message: "Password does not match"
                });

            if (req.body.newPassword.length < 8)
                return res.status(400).json({
                    type: "error",
                    message: "Password must be atleast 8 characters long"
                });

            let user = await User.findOne({ email: data.data.email });
            if (!user)
                return res.status(400).json({
                    type: "error",
                    message: "No user found"
                });

            let pass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET_KEY);
            let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);

            if (req.body.password !== decryptedPassword)
                return res.status(400).json({
                    type: "error",
                    message: "Wrong current password"
                });

            user.password = CryptoJS.AES.encrypt(req.body.newPassword, process.env.CRYPTOJS_SECRET_KEY).toString();
            await user.save();

            res.status(200).json({
                type: "success",
                message: "Password updated successfully"
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
