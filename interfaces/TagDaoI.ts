/**
 * @file Declares API for Tags related data access object methods
 */

import Tag from "../models/tags/Tag";

export default interface TagDaoI {
    createTag(tag: Tag): Promise<Tag>;
    deleteTag(tid: string): Promise<any>;
    findAllTags(): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<any>;
};