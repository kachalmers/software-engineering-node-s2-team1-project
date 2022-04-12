/**
 * @file Implements DAO managing data storage of likes and uses mongoose LikeModel
 * to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of Likes
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Retrieves all likes of a given tuit by users.
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when likes are retrieved from database
     */
    findAllLikesOfTuitByUsers = async (tid: string): Promise<Like[]> =>
        LikeModel.find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Retrieves all likes of tuits by a given user.
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when likes are retrieved from database
     */
    findAllLikesOfTuitsByUser = async (uid: string): Promise<Like[]> =>
        LikeModel.find({likedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Inserts like document for a like by a given user of a given tuit
     * into the database.
     * @param {string} tid Primary key of tuit
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when like is inserted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<Like> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * Removes like document from the database.
     * @param {string} tid Primary key of tuit
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when like is removed from the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid})

    /**
     * Finds like of a given tuit by a given user from the database if it
     * exists.
     * @param {string} tid Primary key of tuit
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when like is found from the database
     */
    findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({tuit: tid, likedBy: uid});

    /**
     * Counts how many users liked a tuit.
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when count is retrieved from the database
     */
    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({tuit: tid});

    /**
     * Retrieves all like documents from the database.
     * @returns Promise To be notified when the likes are retrieved from the
     * database
     */
    findAllLikes = async (): Promise<Like[]> =>
        LikeModel.find()
            .populate('tuit')
            .populate('likedBy', {username: 1})
            .exec();
}