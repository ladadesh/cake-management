import { adminUser } from "../middleware/auth.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
