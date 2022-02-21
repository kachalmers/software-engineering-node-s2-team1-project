/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB.
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI{
    private static followDao: FollowDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns FollowDao
     */
    public static getInstance = (): FollowDao => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }

    private constructor() {}

    /**
     * Uses FollowModel to retrieve all follow documents from follows collection.
     * @returns Promise To be notified when the follows are retrieved from
     * database
     */
    findAllFollows = async (): Promise<Follow[]> =>
        FollowModel.find();

    /**
     * Uses FollowModel to retrieve all users followed by a given user.
     * @param {string} uid Primary key of user following other users
     * @returns Promise To be notified when the users being followed are
     * retrieved from the database
     */
    findAllUsersFollowedByUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({userFollowing: uid})
            .populate("userFollowed")
            .exec();

    /**
     * Uses FollowModel to retrieve all users following a given user.
     * @param {string} uid Primary key of user followed by other users
     * @returns Promise To be notified when the users following the given user
     * are retrieved from the database
     */
    findAllUsersFollowingUser = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({userFollowed: uid}) // find follows where uid is being followed
            .populate("userFollowing") // fill in information about follower
            .exec();

    /**
     * Inserts follow instance into the database.
     * @param {string} uid Primary key of user following other user
     * @param {string} ouid Primary key of user to be followed
     */
    userFollowsUser = async (uid: string, ouid: string): Promise<Follow> =>
        FollowModel.create({userFollowing: uid, userFollowed: ouid});

    /**
     * Removes follow from the database.
     * @param {string} uid Primary key of user to unfollow other user
     * @param {string} ouid Primary key of user to be unfollowed
     */
    userUnfollowsUser = async (uid: string, ouid: string): Promise<any> =>
        FollowModel.deleteOne({userFollowing: uid, userFollowed: ouid});


}