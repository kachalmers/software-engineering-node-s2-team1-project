/**
 * @file Declares API for dislikes related data access object methods
 */

import Dislike from "../models/dislikes/Dislike";

export default interface DislikeDaoI {
    userDislikesTuit(uid: string, tid: string): Promise<Dislike>;
    userUnDislikesTuit(uid: string, tid: string): Promise<any>;
    findAllTuitsDislikedByUser(uid: string): Promise<Dislike[]>;
    countHowManyDislikedTuit(tid: string): Promise<any>;
    findUserDislikesTuit(uid: string, tid: string): Promise<any>;
}