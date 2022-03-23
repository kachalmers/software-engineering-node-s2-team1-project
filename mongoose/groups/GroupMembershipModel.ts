import mongoose from "mongoose";
import GroupMembershipSchema from "./GroupMembershipSchema";
const GroupMembershipModel = mongoose.model('GroupMembershipModel',
    GroupMembershipSchema);
export default GroupMembershipModel;