import mongoose from "mongoose";
const GroupMembershipSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'GroupModel'},
    addedToGroupOn: {type: Date, default: Date.now},
}, {collection: 'groups'});
export default GroupMembershipSchema;