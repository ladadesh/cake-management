import { adminUser } from "../middleware/auth.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import express from "express";
import { ObjectId } from "mongodb";

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

router.delete("/:id", authMiddleware, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(req.params.id);

  if (user) {
    if (user._id.equals(req.user._id)) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await user.deleteOne();
    res.status(200).json({ message: "User removed successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export default router;
