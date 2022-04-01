/**
 * @file Implements mongoose model to CRUD
 * documents in the messages collection
 */
import mongoose from "mongoose";
import MessageSchema from "./MessageSchema";

const MessageModel = mongoose.model('MessageModel', MessageSchema);

export default MessageModel;