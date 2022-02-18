/**
 * @file implements mongoose model to CRUD documents in the likes collection.
 */
import mongoose from "mongoose";
import MessageSchema from "./MessageSchema";

const MessageModel = mongoose.model("MessageModel", MessageSchema);
export default MessageModel;