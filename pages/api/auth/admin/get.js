import User from "../../../../server/models/User";
import connectToDB from "../../../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (data.data.role !== "admin")
                return res.status(400).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            let user;
            if (req.body.query)
                user = await User.find(req.body.query);
            else
                user = await User.find();

            res.status(200).json({
                type: "success",
                message: "User Details Fetched",
                data: user
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