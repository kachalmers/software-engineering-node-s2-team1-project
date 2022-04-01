/**
 * @file Implements DAO managing data storage of dislikes and uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Dislike from "../models/dislikes/Dislike";

/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of Dislikes
 * @property {DislikeDao} dislikeDao Private single instance of DislikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;

    /**
     * Creates singleton DAO instance for dislikes.
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
     * Counts how many users disliked a tuit.
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when count is retrieved from
     * the database
     */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid});

    /**
     * Finds all dislikes of tuits by a given user.
     * @param {string} uid Primary key of user that disliked tuits
     * @returns Promise To be notified when dislikes are retrieved from
     * the database
     */
    findAllDislikesOfTuitsByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel.find({dislikedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Retrieves dislike of tuit by user if it exists.
     * @param {string} uid Primary key of user
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when dislike is found from the database
     */
    findUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid});

    /**
     * Inserts dislike of a tuit by a user into the database.
     * @param {string} tid Primary key of tuit
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when dislike is inserted into the database
     */
    userDislikesTuit = async (uid: string, tid: string): Promise<Dislike> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Removes dislike of a tuit by a user from the database.
     * @param {string} tid Primary key of tuit
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when dislike is removed from the database
     */
    userUnDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});
}