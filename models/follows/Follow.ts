/**
 * @file Declares Follow data type representing relationship between
 * two users, as in user follows another user.
 */
import User from "../users/User";

/**
 * @typedef Follow Represents follows relationship between a user and another
 * user, as in a user follows another user.
 * @property {User} userFollowed User being followed by userFollowing
 * @property {User} userFollowing User following userFollowed
 */
export default interface Follow {
    userFollowed: User,
    userFollowing: User
};