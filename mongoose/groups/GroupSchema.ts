import mongoose from "mongoose";
const GroupSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    createdOn: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: 'groups'});
export default GroupSchema;