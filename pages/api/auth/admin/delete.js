import User from "../../../../server/models/User";
import connectToDB from "../../../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method === "DELETE") {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (data.data.role !== 'admin')
                return res.status(400).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            let user = await User.findOne({ _id: req.body.id });
            if (user && (user.email === "theritiktiwari@gmail.com"))
                return res.status(400).json({
                    type: "error",
                    message: "You can't delete this admin"
                });

            user = await User.findOneAndDelete({ _id: req.body.id });
            if (!user)
                return res.status(400).json({
                    type: "error",
                    message: "No user found"
                });

            return res.status(200).json({
                type: "success",
                message: "User Deleted Successfully"
            });

        } else {
            return res.status(405).json({
                type: "error",
                message: "Method not allowed"
            });
        }
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);
