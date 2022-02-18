/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";

export default class FollowDao implements FollowDaoI{
    private static followDao: FollowDao | null = null;
    public static getInstance = (): FollowDao => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}

    findAllFollows = async (): Promise<Follow[]> =>
        FollowModel.find();

    findAllUsersFollowedByUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({userFollowing: uid})
            .populate("userFollowed")
            .exec();

    findAllUsersFollowingUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({userFollowed: uid}) // find follows where uid is being followed
            .populate("userFollowing") // fill in information about follower
            .exec();

    userFollowsUser = async (uid: string, ouid: string): Promise<Follow> =>
        FollowModel.create({userFollowing: uid, userFollowed: ouid});

    userUnfollowsUser = async (uid: string, ouid: string): Promise<any> =>
        FollowModel.deleteOne({userFollowing: uid, userFollowed: ouid});


}