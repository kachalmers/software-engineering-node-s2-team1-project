/**
 * @file Implements mongoose schema for dislikes
 */
import mongoose, {Schema} from "mongoose";
import Dislike from "../../models/dislikes/Dislike";

/**
 * @typedef DislikeSchema Represents dislikes relationship between users and tuits
 * @property {ObjectId} tuit Id of tuit that is disliked by user
 * @property {ObjectId} dislikedBy Id of user disliking the tuit
 */
const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: {type: Schema.Types.ObjectId, ref: 'TuitModel'},
    dislikedBy: {type: Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: "dislikes"})

export default DislikeSchema