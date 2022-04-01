/**
 * @file Declares Follow data type representing relationship between
 * two users, as in user follows another user.
 */
import User from "../users/User";

/**
 * @typedef Follow Represents follows relationship between a user and another
 * user, as in a user follows another user.
 * @property {User} followee User being followed by follower
 * @property {User} follower User following followee
 */
export default interface Follow {
    followee: User,
    follower: User
};