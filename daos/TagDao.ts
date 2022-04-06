/**
 * @file DAO that implements asynchronous functions associated with Tags
 *       using the TagModel.
 */

import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tag/TagModel";
import Tag from "../models/tags/Tag";

export default class TagDao implements TagDaoI {
    private static tagDao: TagDao | null = null;
    public static getInstance = (): TagDao => {
        if(TagDao.tagDao === null) {
            TagDao.tagDao = new TagDao();
        }
        return TagDao.tagDao;
    }
    private constructor() {}

    /**
     * Inserts tag document into the database.
     * @param {Tag} tag Tag to insert into database
     * @returns Promise To be notified when tag is inserted into the database
     */
    createTag = async (tag: Tag): Promise<Tag> =>
        TagModel.create(tag);

    /**
     * Removes tag document with a given tag from the database.
     * @param {string} tid Primary key of tag
     * @returns Promise To be notified when tag is removed from the database
     */
    deleteTag = async (tid: string): Promise<any> =>
        TagModel.deleteOne({_id: tid});

    /**
     * Retrieves all tag documents from the database.
     * @returns Promise To be notified when the tags are retrieved from
     * database
     */
    findAllTags = async (): Promise<Tag[]> =>
        TagModel.find()
            .exec();

    /**
     * Updates tag with new values in the database.
     * @param {Tag} tag Tag body with new values for tag
     */
    updateTag = async (tag: Tag): Promise<any> =>
        TagModel.updateOne({tag: tag.tag}, {$set: tag})

}