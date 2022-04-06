// Import for later
import Tag from "../models/tags/Tag";

import Tuit from "../models/tuits/Tuit";

/**
 * @file Declares API for Tags related data access object methods
 */
export default interface TagDaoI {
    findAllTags(): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<any>;
    createTag(tag: Tag): Promise<Tag>;
};