import jwt from "jsonwebtoken";
import Admin from "../models/adminmodel.js";

const generateAuthToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const sign_in = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateAuthToken(admin._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
      httpOnly: true, //prevents any XSS attacks
      sameSte: "strict", //prevents any CSRF attacks
      secure: process.env.NODE_ENV === "production", //use secure cookies in production
    });

    return res.status(200).json({
      message: "Sign in successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error in sign_in:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sign_up = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    if (/\d/.test(name)) {
      return res.status(400).json({
        message: "Name cannot contain numbers",
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin with this email already exists",
      });
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    const token = generateAuthToken(newAdmin._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      message: "Sign up successful",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error in sign_up:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sign_out = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      success: true,
      message: "Logged out Successfully",
    });
  } catch (error) {
    console.log(`Error in Logout: ${error}`);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const check_auth = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Admin is authenticated",
      admin: {
        _id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
      },
    });
  } catch (error) {
    console.error("Error in check_auth:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword, email, name } = req.body;
    const { adminId } = req.params;

    if (!oldPassword || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (/\d/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Name cannot contain numbers",
      });
    }

    const existingEmail = await Admin.findOne({ email });

    if (existingEmail && existingEmail._id.toString() !== adminId) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (!(await admin.matchPassword(oldPassword))) {
      return res.status(401).json({
        message: "Invalid current password",
      });
    }

    if (newPassword) {
      admin.password = newPassword;
    }

    admin.name = name;
    admin.email = email;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log("Error in update profile: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
