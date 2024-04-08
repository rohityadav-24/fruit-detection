import User from "../../../server/models/User";
import connectToDB from "../../../server/middleware/db";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            let user = await User.findOne({ _id: req.body.id, verificationToken: req.body.token });
            if (user) {
                if (user.verified)
                    return res.status(400).json({
                        type: "error",
                        message: "User Already Verified"
                    });

                await User.findOneAndUpdate({ _id: req.body.id, verificationToken: req.body.token }, {
                    verified: true,
                });

                res.status(200).json({
                    type: "success",
                    message: "User verified successfully"
                });
            } else {
                res.status(400).json({
                    type: "error",
                    message: "Invalid Token"
                });
            }
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong"
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
