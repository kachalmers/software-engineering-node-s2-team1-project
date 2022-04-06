/**
 * @file DAO that implements asynchronous functions associated with Tags
 *       using the TagModel.
 */

import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tag/TagModel";
import Tag from "../models/tags/Tag";
import Tuit from "../models/tuits/Tuit";
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
     * Retrieves all tag documents from the database.
     * @returns Promise To be notified when the tags are retrieved from
     * database
     */
    findAllTags = async (): Promise<Tag[]> =>
        TagModel.find().exec();


    /**
     * Retrieves all tuit documents from the database with a specified tag
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findTuitsByTag = async (tag: string): Promise<Tuit[]> =>        // TODO: should this be by tag id or tag name (string)?
        TuitModel                                                   // TODO: should this be tuit2tag model?
            .find({tag: tag})                                  // TODO: make sure this matches field in tuit mongoose schema
            .sort({postedOn: -1})
            .exec();

    /**
     * Inserts tag document into the database.                      // TODO: should create/delete go in the T2T dao/controller instead?
     * @param {Tag} tag Tag to insert into database
     * @returns Promise To be notified when tag is inserted into the database
     */
    createTag = async (tag: Tag): Promise<Tag> =>
        TagModel.create(tag);

    /**
     * Removes a tag document from the database
     * @param {Tag} tag Tag being deleted from database
     * @returns Promise to be notified when the tag is deleted
     */
    removeTag = async (tag: string): Promise<any> =>
        TagModel.deleteOne({_id: tag});
}
