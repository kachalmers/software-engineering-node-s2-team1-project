/**
 * @file Implements mongoose schema for follows
 */
import mongoose, {Schema} from "mongoose";
import Follow from "../../models/follows/Follow";

/**
 * @typedef FollowSchema Represents follows relationship between a user and another user
 * @property {ObjectId} userFollowed Id of user who is followed by another user.
 * @property {ObjectId} userFollowing Id of user following another user.
 */
const FollowSchema = new mongoose.Schema<Follow>({
    userFollowed: {type: Schema.Types.ObjectId, ref: 'UserModel'},
    userFollowing: {type: Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: "follows"})

export default FollowSchema