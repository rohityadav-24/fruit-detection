import Pin from "../../server/models/Pin";
import connectToDB from "../../server/middleware/db";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            for (let i = 0; i < req.body.length; i++) {
                let pincodes = new Pin({
                    pincode: req.body[i].pincode,
                    city: req.body[i].city,
                    district: req.body[i].district,
                    state: req.body[i].state
                });
                await pincodes.save();
            }
            res.status(200).json({
                type: "success",
                message: "Products added successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Internal Server Error"
            })
        }
    } else {
        res.status(405).json({
            type: "error",
            message: "Method not allowed"
        });
    }
}

export default connectToDB(handler);
