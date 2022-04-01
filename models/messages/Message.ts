/**
 * @file declares Message data type representing relationship between
 * users and other users, as in user messages a user.
 */
import User from "../users/User";

/**
 * @typedef Message represents message sent by a user to another user.
 * @property {string} message being sent
 * @property {User} to User receiving message
 * @property {User} from User sending message
 * @property {Date} sentOn Date message is sent
 */

export default interface Message {
    message: string,
    to: User,
    from: User,
    sentOn?: Date
};