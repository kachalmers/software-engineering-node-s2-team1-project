/**
 * @file Implements mongoose schema for likes
 */
import mongoose, {Schema} from "mongoose";
import Like from "../../models/likes/Like";

/**
 * @typedef LikeSchema Represents likes relationship between users and tuits
 * @property {ObjectId} tuit Id of tuit that is liked by user
 * @property {ObjectId} likeBy Id of user liking the tuit
 */
const LikeSchema = new mongoose.Schema<Like>({
    tuit: {type: Schema.Types.ObjectId, ref: 'TuitModel'},
    likedBy: {type: Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: "likes"})

export default LikeSchema