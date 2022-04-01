/**
 * @file Implements some service for helping retrieve tuit resources
 */
import LikeDao from "../daos/LikeDao";
import DislikeDao from "../daos/DislikeDao";
import Tuit from "../models/tuits/Tuit";

/**
 * @class TuitService Implements Tuit service that provides some helper functions
 * for helping retrieve the tuits data for complicated needs, for example:
 * Retrieve tuits when user logged in, it will also check if user owns the tuit, likes/dislikes the tuit
 */
export default class TuitService {
    public static tuitService: TuitService | null = null;
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    /**
     * Creates singleton Service instance
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
     * Iterating through given tuits, check if each tuit is owned by given user, and
     * also check if given user likes/dislikes the tuit and inserts likedByMe, dislikedByMe,
     * and ownedByMe attributes to the tuit object. This helps the client to determine if user
     * likes/dislikes/owns the tuit and display different view.
     * @param {any} userId User's primary key
     * @param {Tuit[]} tuits An array of tuits
     */
    public fetchTuitsForLikesDisLikeOwn = async (userId: any, tuits: Tuit[]): Promise<any[]> => {
        let findLikesPromises: any[] = []
        let findDislikesPromises: any[] = []

        tuits.forEach((t: any) => {
            let findLikePromise = TuitService.likeDao.findUserLikesTuit(userId, t._id);
            let findDislikePromise = TuitService.dislikeDao.findUserDislikesTuit(userId, t._id);
            findLikesPromises.push(findLikePromise);
            findDislikesPromises.push(findDislikePromise);
        })
        const likedTuits = await Promise.all(findLikesPromises);
        const dislikedTuits = await Promise.all(findDislikesPromises);
        const likedTuitsIds = likedTuits.map((l) => {
            if (l) {
                return l.tuit.toString();
            }
        })
        const dislikedTuitsIds = dislikedTuits.map((l) => {
            if (l) {
                return l.tuit.toString();
            }
        })

        const fetchTuits = tuits.map((t: any) => {
            let copyT = t.toObject();
            if (likedTuitsIds.indexOf(t._id.toString()) >= 0) {
                copyT = {...copyT, likedByMe: true};
            }
            if (dislikedTuitsIds.indexOf(t._id.toString()) >= 0) {
                copyT = {...copyT, dislikedByMe: true};
            }
            if (copyT.postedBy._id.toString() === userId.toString()) {
                copyT = {...copyT, ownedByMe: true};
            }
            return copyT;
        })
        return fetchTuits;
    }
}