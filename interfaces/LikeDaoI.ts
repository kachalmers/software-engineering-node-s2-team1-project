/**
 * @file Declares API for Likes related data access object methods
 */
import Like from "../models/likes/Like"

export default interface LikeDaoI {
    findLikesOfAllUsersThatLikedTuit(tid: string): Promise<Like[]>;
    findLikesOfAllTuitsLikedByUser(uid: string): Promise<Like[]>;
    userUnlikesTuit(uid: string, tid: string): Promise<any>;
    userLikesTuit(uid: string, tid: string): Promise<Like>;
    findAllLikes(): Promise<Like[]>;
    findUserLikesTuit(uid: string, tid: string): Promise<any>;
    countHowManyLikedTuit(tid: string): Promise<any>;
}