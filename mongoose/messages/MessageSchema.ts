/**
 * @file Implements mongoose schema for messages
 */
import mongoose, {Schema} from "mongoose";
import Message from "../../models/messages/Message";

/**
 * @typedef MessageSchema Represent messages relationship between a user and another user
 * @property {ObjectId} to Id of user received the message
 * @property {ObjectId} from Id of user sending the message
 * @property {string} message Content of the message
 * @property {Date} sentOn When message is sent
 */
const MessageSchema = new mongoose.Schema<Message>({
    to: {type: Schema.Types.ObjectId, ref: 'UserModel'},
    from: {type: Schema.Types.ObjectId, ref: 'UserModel'},
    message: {type: String, required: true},
    sentOn: {type: Date, default: Date.now}
}, {collection: 'messages'})

export default MessageSchema