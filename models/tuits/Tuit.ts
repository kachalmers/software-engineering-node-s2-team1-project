/**
 * @file declares Tuit data type representing a tuit posted by a user.
 */
import User from "../users/User";

/**
 * @typedef Tuit represents tuit posted by a user.
 * @property {string} tuit text being tuited
 * @property {User} postedBy User posting tuit
 * @property {Date} postedOn Date tuit is posted
 */
export default interface Tuit {
    tuit: string,
    postedBy: User,
    postedOn?: Date,
};