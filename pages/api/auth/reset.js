import User from "../../../server/models/User";
import connectToDB from "../../../server/middleware/db";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            if (req.body.sendMail) {
                let token = uuidv4();
                const user = await User.findOne({ email: req.body.email });
                if (!user)
                    return res.status(400).json({
                        type: "error",
                        message: "User not found"
                    });

                if (!user.verified)
                    return res.status(400).json({
                        type: "error",
                        message: "Please verify your account first"
                    });

                user.resetToken = token;
                await user.save();

                let url = `${process.env.NEXT_PUBLIC_HOST}/auth/reset?code=${token}&user=${user.id}`;
                let data = `
                    <div>
                        <h1>${req.body.siteName}</h1>
                        <h2>Reset Your Password</h2>
                        <p>Click the link below to reset your password</p>
                        <a href="${url}">Reset Password</a>
                    </div>
                    `;

                const mail = await fetch(`${process.env.NEXT_PUBLIC_MAILER}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sender: {
                            name: process.env.MAIL_SENDER_NAME,
                            mail: process.env.MAIL_SENDER_EMAIL,
                            password: process.env.MAIL_SENDER_PASSWORD
                        },
                        receiver: user.email,
                        subject: "Reset Password",
                        data
                    })
                });
                const mail_sent = await mail.json();

                if (mail_sent.type == "error")
                    return res.status(400).json({
                        type: "error",
                        message: mail_sent.message
                    });

                res.status(200).json({
                    type: "success",
                    message: "Email sent successfully"
                });
            } else {
                const _id = req.body.id;
                const resetToken = req.body.token;
                const newPassword = req.body.newPassword;
                const confirmNewPassword = req.body.confirmNewPassword;

                if (!_id || !resetToken || !newPassword || !confirmNewPassword)
                    return res.status(400).json({
                        type: "error",
                        message: "Please fill all the fields"
                    });

                if (!_id.match(/^[0-9a-fA-F]{24}$/))
                    return res.status(400).json({
                        type: "error",
                        message: "Invalid request."
                    });

                if (newPassword.length < 8)
                    return res.status(400).json({
                        type: "error",
                        message: "Password must be atleast 8 characters long"
                    });

                if (newPassword !== confirmNewPassword)
                    return res.status(400).json({
                        type: "error",
                        message: "Password does not match"
                    });

                let user = await User.findOne({ _id: req.body.id, resetToken: req.body.token });
                if (!user)
                    return res.status(400).json({
                        type: "error",
                        message: "Could not reset the password"
                    });

                user.password = CryptoJS.AES.encrypt(req.body.newPassword, process.env.CRYPTOJS_SECRET_KEY).toString();
                user.resetToken = null
                await user.save();

                res.status(200).json({
                    type: "success",
                    message: "Password Changed Successfully"
                });
            }
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
