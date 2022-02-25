/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB.
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of Likes.
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;

    /**
     * Creates singleton DAO instance.
     * @returns {LikeDao} LikeDao
     */
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Uses LikeModel to retrieve all likes of a tuit by users.
     * @param {string} tid Primary key of tuit liked by users
     * @returns {Promise} Promise to be notified when the likes are retrieved from
     * database
     */
    findLikesOfTuitByUsers = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Uses LikeModel to retrieve all likes of tuits by a user.
     * @param {string} uid Primary key of user that liked tuits
     * @return {Promise} Promise to be notified when the likes are retrieved from
     * database
     */
    findLikesOfTuitsByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({likedBy: uid})
            .populate("tuit")
            .exec();

    /**
     * Inserts like instance into the database.
     * @param {string} uid Primary key of user to like tuit
     * @param {string} tid Primary key of tuit to be liked
     * @return {Promise} Promise to be notified when like is inserted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * Removes like from the database.
     * @param {string} uid Primary key of user to unlike tuit
     * @param {string} tid Primary key of tuit to be unliked
     * @return {Promise} Promise to be notified when like is removed from database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});
}