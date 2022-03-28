import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";
const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
    postedOn: {type: Date, default: Date.now},
    image: String,
    youtube: String,
    avatarLogo: String,
    imageOverlay: String,
    stats: {    // initialize tuit's stats attribute
        replies: {type: Number, default: 0},    // set default value of stats to 0
        retuits: {type: Number, default: 0},    // set default value of stats to 0
        likes: {type: Number, default: 0},    // set default value of stats to 0
        dislikes: {type: Number, default: 0}    // set default value of stats to 0
    }
}, {collection: "tuits"});
export default TuitSchema;