import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  try {
    const header = req?.header("Authorization")?.split(" ");
    const [_, token] = header;

    if (!token) return res.status(404).send({ message: "Token not found!" });

    const data = jwt.decode(token, process.env.TOKEN_SECRET_KEY);
    req.user = data;

    next();
  } catch (error) {
    res
      .status(400)
      .send({ error_message: `Unauthorized: ${error.message}` });
  }
}
