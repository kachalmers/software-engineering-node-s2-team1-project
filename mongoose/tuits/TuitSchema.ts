/**
 * @file Implements the structure of the data (schema) being stored in the
 * database. Used to validate the data before being stored.
 */
import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";

const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
    postedOn: {type: Date, default: Date.now}
}, {collection: "tuits"});

export default TuitSchema;