/**
 * @file declares API for Likes related data access object methods.
 */
import Like from "../models/likes/Like";

export default interface LikeDaoI {
    findLikesOfTuitByUsers (tid: string): Promise<Like[]>;
    findLikesOfTuitsByUser (uid: string): Promise<Like[]>;
    userUnlikesTuit (tid: string, uid: string): Promise<any>;
    userLikesTuit (tid: string, uid: string): Promise<Like>;
};