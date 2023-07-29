import express from "express";
import message from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .get("/:roomId", protect, message.getAllMessages)
  .post("/", protect, message.createMessage)
  .get("/:id", protect, message.getOneMessage)
  .delete("/:id", protect, message.deleteOneMessage);

export default router;
