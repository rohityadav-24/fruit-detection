import Subscribe from "../../server/models/Subscribe";
import connectToDB from "../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            if (req.body.type && (req.body.type === "GET_DATA")) {
                const { token } = req.body;
                const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
                if (user.data.role !== "admin")
                    return res.status(401).json({
                        type: "error",
                        message: "You are not authorized to perform this action"
                    });

                let subs = await Subscribe.find();
                return res.status(200).json({
                    type: "success",
                    data: subs
                });
            }
            const { email } = req.body;
            if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
                return res.status(400).json({
                    type: "error",
                    message: "Please use a valid email address",
                });

            const allowedDomains = ["gmail.com", "yahoo.com", "rediffmail.com", "outlook.com"];
            if (!allowedDomains.includes(email.split("@")[1]))
                return res.status(400).json({
                    type: "error",
                    message: "Please use a valid email address"
                });

            let exist = await Subscribe.findOne({ email });

            if (req.body.type && (req.body.type === "unsubscribe")) {
                if (!exist)
                    return res.status(400).json({
                        type: "error",
                        message: "Email is not subscribed",
                    });

                await Subscribe.findOneAndUpdate({ email }, { subscribed: false });
                return res.status(200).json({
                    type: "success",
                    message: "Unsubscribed Successfully"
                });
            } else {
                if (exist)
                    return res.status(400).json({
                        type: "error",
                        message: "Already Subscribed"
                    });

                let subs = new Subscribe({ email });
                await subs.save();
                res.status(200).json({
                    type: "success",
                    message: "Subscribed Successfully"
                });
            }
        } else if (req.method === "DELETE") {
            const { id, token } = req.body;

            const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (user.data.role !== "admin")
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            let subs = await Subscribe.findByIdAndDelete(id);
            if (!subs)
                return res.status(400).json({
                    type: "error",
                    message: "Not Found"
                });
            res.status(200).json({
                type: "success",
                message: "Deleted Successfully"
            });
        } else {
            res.status(405).json({
                type: "error",
                message: "Method not allowed"
            });
        }
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);
