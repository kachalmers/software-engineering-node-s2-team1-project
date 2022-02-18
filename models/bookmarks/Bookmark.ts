/**
 * @file declares Bookmark data type representing relationship between
 * users and tuits, as in user bookmarked a tuit.
 */
import Tuit from "../tuits/Tuit";
import User from "../users/User";

/**
 * @typedef Bookmark Represents bookmarked relationship between a user and a
 * tuit, as in a user bookmarked a tuit.
 * @property {Tuit} tuit Tuit being bookmarked
 * @property {User} likedBy User bookmarking the tuit
 */
export default interface Bookmark {
    tuit: Tuit,
    bookmarkedBy: User
};