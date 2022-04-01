/**
 * @file Declares Message data type representing relationship between two users,
 * as in a user messages another user
 */
import User from "../users/User";

/**
 * @typedef Message Represents messages relationship between two users,
 * as in a user messages another user
 * @property {User} to User messaged by another user.
 * @property {User} from User sending the message
 * @property {string} message Content of the massage
 * @property {Date} sentOn Date the message sent
 */
export default interface Message {
    to: User,
    from: User,
    message: string,
    sentOn: Date
}