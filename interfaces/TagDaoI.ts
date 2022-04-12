/**
 * @file Declares API for Tags related data access object methods
 */

import Tag from "../models/tags/Tag";

export default interface TagDaoI {
    createTag(tag: Tag): Promise<Tag>;
    deleteTag(tagID: string): Promise<any>;
    findAllTags(): Promise<Tag[]>;
    findTagByText(tag: string): Promise<any>;
    updateTag(tag: Tag): Promise<any>;
    findTagById(tagID: string): Promise<any>;
};