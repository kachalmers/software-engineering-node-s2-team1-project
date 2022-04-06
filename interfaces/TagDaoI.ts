// Import for later
import Tag from "../models/tags/Tag";

import Tuit from "../models/tuits/Tuit";

/**
 * @file Declares API for Tags related data access object methods
 */
export default interface TagDaoI {
    createTag(tag: Tag): Promise<Tag>;
    deleteTag(tag: string): Promise<any>;
    findAllTags(): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<any>;
};