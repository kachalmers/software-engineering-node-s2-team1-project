// Import for later
//import Tag from "../models/tags/Tag";

/**
 * @file Declares API for Tags related data access object methods
 */
export default interface TagDaoI {
    findAllUsersThatTaggedTuit (tid: string): Promise<Tag[]>; // Likely need to add/adjust parameters
    findAllTuitsTaggedByUser (uid: string): Promise<Tag[]>;
    userUntagsTuit (tid: string, uid: string): Promise<any>;
    userTagsTuit (tid: string, uid: string): Promise<Tag>;
};