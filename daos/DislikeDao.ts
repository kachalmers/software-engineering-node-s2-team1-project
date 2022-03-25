import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Dislike from "../models/dislikes/Dislike";

export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;

    public static getInstance = (): DislikeDao => {
        if(DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }

    private constructor() {}

    findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({tuit: tid})
            .populate("dislikedBy")
            .exec();

    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({dislikedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Insert document into dislikes collection to record that user uid dislikes tuit
     * tid.
     * @param uid User to dislike the tuit
     * @param tid Tuit to be disliked by user
     */
    userDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Check if there's a dislikes document in the database for user/tuit
     * combination.
     * @param uid User that disliked tuit
     * @param tid Tuit that was disliked
     */
    findUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid});

    /**
     * Delete document from dislikes collection to record that user uid no longer
     * dislikes tuit tid.
     * @param uid User that disliked tuit
     * @param tid Tuit that was disliked by user
     */
    userUndislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});

    /**
     * Count how many users disliked a tuit.
     * @param tid
     */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid});
}