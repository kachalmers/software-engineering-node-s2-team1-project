import GroupModel from "../mongoose/groups/GroupModel";
import GroupMembershipModel from "../mongoose/groups/GroupMembershipModel";
export const findAllGroups = () =>
    GroupModel.find();
export const findGroupById = (gid: string) =>
    GroupModel.findById(gid);
export const findGroupByName = (name: string) =>
    GroupModel.findOne({name});
export const createGroup = (group: any) =>
    GroupModel.create(group);
export const deleteGroup = (gid: string) =>
    GroupModel.deleteOne({_id: gid});
export const addUserToGroup = (uid: string, gid: string) =>
    GroupMembershipModel.create({user: uid, group: gid});
export const removeUserFromGroup = (uid: string, gid: string) =>
    GroupMembershipModel.deleteOne({user: uid, group: gid});
export const findUsersInGroup = (gid: string) =>
    GroupMembershipModel.find({group: gid})
        .populate('user')
        .exec();
export const findGroupsForUser = (uid: string) =>
    GroupMembershipModel.find({user: uid})
        .populate('group')
        .exec();