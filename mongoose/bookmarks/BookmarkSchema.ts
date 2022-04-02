/**
 * @file Implements mongoose schema for bookmarks
 */
import mongoose, {Schema} from "mongoose";
import Bookmark from "../../models/bookmarks/Bookmark";

/**
 * @typedef BookmarkSchema Represent bookmarks relationship between users and tuits
 * @property {ObjectId} tuit Id of tuit that is bookmarked by user
 * @property {ObjectId} bookmarkedBy Id of user who bookmarking the tuit
 */
const BookmarkSchema = new mongoose.Schema<Bookmark>({
    tuit: {type: Schema.Types.ObjectId, ref: 'TuitModel'},
    bookmarkedBy: {type: Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: 'bookmarks'})

export default BookmarkSchema