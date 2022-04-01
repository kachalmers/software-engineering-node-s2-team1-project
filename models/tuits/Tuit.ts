/**
 * @file Declares Tuit data type representing tuit. A Tuit will be posted by a User.
 */
import User from '../users/User'

/**
 * @typedef Tuit Represents tuit.
 * @property {string} tuit Content of the tuit.
 * @property {Date} postedOn The date of this tuit posted on.
 * @property {User} postedBy The user who posted the tuit.
 */
export default class Tuit {
    private tuit: string = '';
    private postedOn: Date = new Date();
    private postedBy: User | null = null;
}
