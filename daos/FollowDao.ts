/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB.
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";
import User from "../models/users/User";
import Tag from "../models/tags/Tag";
import Tuit2TagModel from "../mongoose/tags/Tuit2TagModel";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI{
    private static followDao: FollowDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns {FollowDao} FollowDao
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
     * @returns {Promise} Promise to be notified when the follows are retrieved from
     * database
     */
    findAllFollows = async (): Promise<Follow[]> =>
        FollowModel.find();

    /**
     * Uses FollowModel to retrieve all follows by a user (follower).
     * @param {string} uid Primary key of user following other users
     * @returns {Promise} Promise to be notified when the users being followed are
     * retrieved from the database
     */
    findFollowsByFollower = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({follower: uid})
            .populate("followee")
            .exec();

    findUsersFollowedByUser = async (uid: string): Promise<User[]> => {
        let follows = await FollowModel
            .find({follower: uid})
            .populate("followee")
            .exec();

        return follows.map(follow => follow.followee);
    }

    /**
     * Uses FollowModel to retrieve all follows of a user (followee).
     * @param {string} uid Primary key of user followed by other users
     * @returns {Promise} Promise to be notified when the users following the given user
     * are retrieved from the database
     */
    findFollowsByFollowee = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({followee: uid}) // find follows where uid is being followed
            .populate("follower") // fill in information about follower
            .exec();

    /**
     * Uses FollowModel to retrieve follow of user by user given the two uids.
     * @param {string} uid Primary key of user following other user
     * @param {string} ouid Primary key of user being followed
     * @returns {Promise} Promise to be notified when the follow is retrieved from the
     * database
     */
    findFollowByUsers = async (uid: string, ouid: string): Promise<any> =>
        FollowModel
            .findOne({follower: uid, followee: ouid})
            .populate("follower")  // fill in information about follower
            .populate("followee");   // fill in information about followee

    /**
     * Inserts follow instance into the database.
     * @param {string} uid Primary key of user following other user
     * @param {string} ouid Primary key of user to be followed
     * @return {Promise} Promise to be notified when follow is added to
     * database
     */
    userFollowsUser = async (uid: string, ouid: string): Promise<Follow> =>
        FollowModel.create({follower: uid, followee: ouid});

    /**
     * Removes follow from the database.
     * @param {string} uid Primary key of user to unfollow other user
     * @param {string} ouid Primary key of user to be unfollowed
     * @return {Promise} Promise to be notified when follow is removed from
     * database
     */
    userUnfollowsUser = async (uid: string, ouid: string): Promise<any> =>
        FollowModel.deleteOne({follower: uid, followee: ouid});


}