/**
 * @file Implements mongoose schema for tuits
 */
import mongoose from "mongoose";
import Tuit from "../../models/tuits/Tuit";

/**
 * @typedef TuitSchema Represents tuits
 * @property {string} tuit Content of the tuit
 * @property {Date} postedOn When tuit is posted
 * @property {ObjectId} postedBy Id of the user who posted the tuit.
 */
const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    postedOn: {type: Date, default: Date.now},
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    stats: {
        replies: {type: Number, default: 0},
        retuits: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0}
    }
}, {collection: 'tuits'})

export default TuitSchema