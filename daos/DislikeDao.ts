/**
 * @file Implements DAO managing data storage of dislikes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Dislike from "../models/dislikes/Dislike";

/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of dislikes
 * @property {DislikeDao} dislikeDao Private single instance of dislikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns DislikeDao
     */
    public static getInstance = (): DislikeDao => {
        if (DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }

    private constructor() {}

    /**
     * Uses LikeModel to count how many dislikes a tuit has
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when count is retrieved from that database
     */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid});

    /**
     * Uses LikeModel to retrieve all dislike documents for a particular user from
     * dislikes collection. Then, populates tuit documents from tuits collection,
     * so that it helps find all tuits that are disliked by a particular user.
     * @param {string} uid User's primary key
     * @returns Promise To be notified when dislikes are retrieved from database
     */
    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel.find({dislikedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Use LikeModel to determine if a user dislikes a tuit.
     * @param {string} uid user's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when dislike is found from the database
     */
    findUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid});

    /**
     * Inserts dislike instance into the database
     * representing a user dislikes a tuit
     * @param {string} tid Tuit's primary key
     * @param {string} uid User's primary key
     * @returns Promise To be notified when dislike is inserted into the database
     */
    userDislikesTuit = async (uid: string, tid: string): Promise<Dislike> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Removes dislike from the database
     * representing a user undo dislikes a tuit
     * @param {string} tid Tuit's primary key
     * @param {string} uid User's primary key
     * @returns Promise To be notified when dislike is removed from the database
     */
    userUnDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});
}