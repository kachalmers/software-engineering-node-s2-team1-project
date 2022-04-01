/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
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

    /**
     * Creates singleton DAO instance
     * @returns LikeDao
     */
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Uses LikeModel to retrieve all like documents for a particular tuit from
     * likes collection. Then, populates user documents from users collection,
     * so that it helps find all users who liked a particular tuit.
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when likes are retrieved from database
     */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel.find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Uses LikeModel to retrieve all like documents for a particular user from
     * likes collection. Then, populates tuit documents from tuits collection,
     * so that it helps find all tuits that are liked by a particular user.
     * @param {string} uid User's primary key
     * @returns Promise To be notified when likes are retrieved from database
     */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel.find({likedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Inserts like instance into the database
     * representing a user likes a tuit
     * @param {string} tid Tuit's primary key
     * @param {string} uid User's primary key
     * @returns Promise To be notified when like is inserted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<Like> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * Removes like from the database
     * representing a user unlikes a tuit
     * @param {string} tid Tuit's primary key
     * @param {string} uid User's primary key
     * @returns Promise To be notified when like is removed from the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid})

    /**
     * Use LikeModel to determine if a user likes a tuit.
     * @param {string} uid user's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when like is found from the database
     */
    findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({tuit: tid, likedBy: uid});

    /**
     * Uses LikeModel to count how many likes a tuit has.
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when count is retrieved from that database
     */
    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({tuit: tid});

    /**
     * Uses LikeModel to retrieve all like documents from likes collection
     * @returns Promise To be notified when the likes are retrieved from database
     */
    findAllLike = async (): Promise<Like[]> =>
        LikeModel.find()
            .populate('tuit')
            .populate('likedBy', {username: 1})
            .exec();
}