/**
 * @file Declares Tuit data type representing tuit to be posted by a User.
 */
import User from '../users/User'
import Stats from "./Stats";

/**
 * @typedef Tuit Represents tuit
 * @property {string} tuit Content of the tuit
 * @property {User} postedBy The user who posted the tuit
 * @property {Date} postedOn The date of this tuit posted on
 */
export default interface Tuit {
    tuit: string,
    postedBy: User,
    postedOn?: Date,
    image?: String,
    youtube?: String,
    avatarLogo?: String,
    imageOverlay?: String,
    stats: Stats
};