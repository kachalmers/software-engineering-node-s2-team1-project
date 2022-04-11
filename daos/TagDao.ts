/**
 * @file DAO that implements asynchronous functions associated with Tags
 *       using the TagModel.
 */

import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tag/TagModel";
import Tag from "../models/tags/Tag";
import TuitModel from "../mongoose/tuits/TuitModel";

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
     * @param {Tag} Tag Tag to insert into database
     * @returns Promise To be notified when tag is inserted into the database
     */
    createTag = async (tag: Tag): Promise<Tag> => {
        const newTag = tag.tag; // The potentially new tag

        // Acquire tag if it exists
        let existingTag = await this.findTagByText(newTag.toString());
        // If tag already exists
        if (existingTag) {
            // Then increase count by one and update that tag
            existingTag.count++;
            await this.updateTag(existingTag);
            return this.findTagByText(existingTag.tag);
        }
        // Else
        else {
            // create a new tag
            return TagModel.create(tag);
            }
    }

    /**
     * Removes tag document with a given tag from the database.
     * @param {string} tagID Primary key of tag
     * @returns Promise To be notified when tag is removed from the database
     */
    deleteTag = async (tagID: string): Promise<any> =>
        TagModel.deleteOne({_id: tagID});

    /**
     * Retrieves all tag documents from the database.
     * @returns Promise To be notified when the tags are retrieved from
     * database
     */
    findAllTags = async (): Promise<Tag[]> =>
        TagModel.find()
            .sort({count: -1})
            .exec();

    /**
     * Retrieves tag with given primary key.
     * @param {string} tagID Primary key of tag
     * @returns Promise To be notified when the tag is retrieved from database
     */
    findTagById = async (tagID: string): Promise<any> =>
        TagModel.findById(tagID).exec();

    /**
     * Retrieves tag documents with given tag text from the database.
     * @param {string} tag Tag's tag text
     * @returns Promise To be notified when user is retrieved from the database
     */
    findTagByText = async (tag: string): Promise<any> =>
        TagModel.findOne({tag});

    /**
     * Updates tag with new values in the database.
     * @param {Tag} tag Tag body with new values for tag
     */
    updateTag = async (tag: Tag): Promise<any> =>
        TagModel.updateOne({tag: tag.tag}, {$set: tag})

}