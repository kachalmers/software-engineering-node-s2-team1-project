/**
 * @file Implements helper service for retrieving tuit information.
 */
import LikeDao from "../daos/LikeDao";
import DislikeDao from "../daos/DislikeDao";
import Tuit from "../models/tuits/Tuit";

/**
 * @class TuitService Implements Tuit service to help with tuit data
 * retrieval and checking.
 */
export default class TuitService {
    public static tuitService: TuitService | null = null;
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    /**
     * Creates singleton TuitService instance.
     * @returns TuitService
     */
    public static getInstance = (): TuitService => {
        if (TuitService.tuitService === null) {
            TuitService.tuitService = new TuitService();
        }
        return TuitService.tuitService;
    }

    private constructor() {}

    /**
     * Loop through given tuits and check for tuit-user relationships,
     * including ownership of a given tuit by the given user, likes of a given
     * tuit by the given user, and dislikes of a given tuit by the given user.
     * If any checks pass, an ownedByMe, likedByMe, and/or dislikedByMe
     * attribute will be added to the tuit to assist the client in determining
     * the user's relationships with the tuit.
     * @param {any} userId Primary key of user
     * @param {Tuit[]} tuits Array of tuits
     */
    public fetchTuitsForLikesDisLikesOwn = async (userId: any, tuits: Tuit[]): Promise<any[]> => {
        let likesOfTuitsByUser: any[] = []
        let dislikesOfTuitsByUser: any[] = []

        // For each tuit...
        tuits.forEach((tuit: any) => {
            // Find like of tuit by user if it exists
            let likeOfTuitByUser = TuitService.likeDao
                .findUserLikesTuit(userId, tuit._id);

            // Find dislike of tuit by user if it exists
            let dislikesOfTuitByUser = TuitService.dislikeDao
                .findUserDislikesTuit(userId, tuit._id);

            // Add likeOfTuitByUser to list of likes of tuits by user
            likesOfTuitsByUser.push(likeOfTuitByUser);

            // Add dislikesOfTuitByUser to list of dislikes of tuits by user
            dislikesOfTuitsByUser.push(dislikesOfTuitByUser);
        })
        // Wait for all likes/dislikes by user to be found
        const allLikesOfTuitsByUser = await Promise.all(likesOfTuitsByUser);
        const allDislikesOfTuitsByUser = await Promise.all(dislikesOfTuitsByUser);

        // Store array of ids of likes of tuits by user
        const allLikesOfTuitsByUserIds = allLikesOfTuitsByUser
            .map((like) => {
                if (like) { return like.tuit.toString(); }
            })

        // Store array of ids of dislikes of tuits by user
        const allDislikesOfTuitsByUserIds = allDislikesOfTuitsByUser
            .map((dislike) => {
                if (dislike) { return dislike.tuit.toString(); }
            })

        const fetchTuits = tuits.map((tuit: any) => {
            let tuitCopy = tuit.toObject();

            if (allLikesOfTuitsByUserIds.indexOf(tuit._id.toString()) >= 0) {
                tuitCopy = {...tuitCopy, likedByMe: true};
            }
            if (allDislikesOfTuitsByUserIds.indexOf(tuit._id.toString()) >= 0) {
                tuitCopy = {...tuitCopy, dislikedByMe: true};
            }
            if (tuitCopy.postedBy && tuitCopy.postedBy._id.toString() === userId.toString()) {
                tuitCopy = {...tuitCopy, ownedByMe: true};
            }
            return tuitCopy;
        })
        return fetchTuits;
    }
}