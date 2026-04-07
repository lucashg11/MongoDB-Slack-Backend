import mongoose from "mongoose";

const channelMessageSchema = new mongoose.Schema({
  fk_id_channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fk_id_member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkspaceMember",
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ChannelMessage = mongoose.model("ChannelMessage", channelMessageSchema);

export default ChannelMessage;
