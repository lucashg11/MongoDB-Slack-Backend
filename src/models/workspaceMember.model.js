
import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    fk_id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /*email: {
      type: String,
      required: true,
    },*/
    fk_id_workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "user"],
      default: "member",
    },
    acceptInvitation: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  }
);

const WorkspaceMember = mongoose.model("WorkspaceMember", workspaceMemberSchema);

export default WorkspaceMember;
