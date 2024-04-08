import Contact from "../../server/models/Contact";
import connectToDB from "../../server/middleware/db";
import jwt from "jsonwebtoken";

const checkAdmin = (token) => {
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (user.data.role !== "admin")
            return false;
        return true;
    } catch (err) {
        return false;
    }
}

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            if (req.body.type && (req.body.type !== "GET_DATA")) {
                const { name, email, subject, message } = req.body;
                if (!name || !email || !subject || !message)
                    return res.status(400).json({
                        type: "error",
                        message: "Please fill out all fields"
                    });

                let cont = new Contact(req.body);
                await cont.save();

                return res.status(200).json({
                    type: "success",
                    message: "Message Send Successfully"
                });

            } else {
                if (checkAdmin(req.body.token) === false)
                    return res.status(403).json({
                        type: "error",
                        message: "You are not authorized to perform this action"
                    });

                let contacts;
                if (req.body.query)
                    contacts = await Contact.find(req.body.query);
                else
                    contacts = await Contact.find({}).sort({ createdAt: -1 });

                return res.status(200).json({
                    type: "success",
                    message: "Data fetched successfully",
                    data: contacts
                });
            }
        } else if (req.method === "PUT") {
            if (checkAdmin(req.body.token) === false)
                return res.status(403).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            const { _id, status, reply } = req.body;
            if (!_id || !status || !reply)
                return res.status(400).json({
                    type: "error",
                    message: "Please fill out all fields"
                });

            await Contact.findOneAndUpdate({ _id }, { status, reply });
            return res.status(200).json({
                type: "success",
                message: "Data updated successfully"
            });

        } else if (req.method === "DELETE") {
            if (checkAdmin(req.body.token) === false)
                return res.status(403).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            const contact = await Contact.findOneAndDelete({ _id: req.body._id });
            if (!contact)
                return res.status(404).json({
                    type: "error",
                    message: "Data not found"
                });

            return res.status(200).json({
                type: "success",
                message: "Data deleted successfully"
            });

        } else {
            return res.status(405).json({
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
