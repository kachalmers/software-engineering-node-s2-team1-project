// Import for later
import Tag from "../models/tags/Tag";

import Tuit from "../models/tuits/Tuit";

/**
 * @file Declares API for Tags related data access object methods
 */
export default interface TagDaoI {
    findAllTags(): Promise<Tag[]>;
    findAllUsersThatTaggedTuit (tid: string): Promise<Tag[]>; // Likely need to add/adjust parameters
    findAllTuitsTaggedByUser (uid: string): Promise<Tag[]>;
    userUntagsTuit (tid: string, uid: string): Promise<any>;
    userTagsTuit (tid: string, uid: string): Promise<Tag>;
    createTag(tag: Tag): Promise<Tag>;
};