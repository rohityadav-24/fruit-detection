import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method !== "POST")
            return res.status(400).json({
                type: "error",
                message: "Method not allowed"
            });

        const { receiver, subject, data, token, cc, bcc } = req.body;

        if (!data || !token || !subject)
            return res.status(400).json({
                type: "error",
                message: "Please fill out all fields"
            });

        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (user.data.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action"
            });

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
                receiver: receiver ? receiver : null,
                subject,
                data,
                cc: cc ? cc : null,
                bcc: bcc ? bcc : null
            })
        });
        const mail_sent = await mail.json();

        if (mail_sent.type == "error")
            return res.status(400).json({
                type: "error",
                message: "Something went wrong"
            });

        res.status(200).json({
            type: "success",
            message: "Email sent successfully."
        });

    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default handler;