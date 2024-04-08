import pincodes from "../../Components/assets/pincodes.json";

export default function handler(req, res) {
  res.status(200).json(pincodes);
}
