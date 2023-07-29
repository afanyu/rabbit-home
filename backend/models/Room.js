import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    messages: [Object],
    latestMessage: Object,
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
