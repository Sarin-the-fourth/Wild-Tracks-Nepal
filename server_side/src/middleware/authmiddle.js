import Admin from "../models/adminmodel.js";
import jwt from "jsonwebtoken";

export const is_admin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid Token",
      });
    }

    const admin = await Admin.findById(decode.id);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied - Admins only",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in is_admin middleware:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
