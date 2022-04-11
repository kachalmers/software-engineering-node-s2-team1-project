/**
 * @file Declares API for Tuit2Tags related data access object methods
 */

import Tuit2Tag from "../models/tags/Tuit2Tag";
import Tag from "../models/tags/Tag";

export default interface Tuit2TagDaoI {
    createTuit2Tag(tuitID: string, tagID: string): Promise<Tuit2Tag>;
    deleteTuit2Tag(tuitID: string, tagID: string): Promise<any>;
    findTagsByTuit(tid: string): Promise<Tuit2Tag[]>;
};